package com.pingfloyd.doy.other;

import com.pingfloyd.doy.entities.Address;
import com.pingfloyd.doy.entities.District;
import com.pingfloyd.doy.entities.MenuItem;
import com.pingfloyd.doy.entities.Restaurant;
import com.pingfloyd.doy.enums.Allergens;
import com.pingfloyd.doy.enums.CityEnum;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils; // For checking empty strings

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class RestaurantSpecification {

    // Private constructor to prevent instantiation
    private RestaurantSpecification() {}

    public static Specification<Restaurant> filterBy(
            String name,
            Float minRating,
            Double maxMinOrderPrice,
            String cuisine,
            String districtName,
            CityEnum city
            , Set<Allergens> customerAllergens
            ) {

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(name)) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("restaurantName")),
                        "%" + name.toLowerCase() + "%"
                ));
            }

            if (minRating != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                        root.get("rating"),
                        minRating
                ));
            }

            if (maxMinOrderPrice != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                        root.get("minOrderPrice"),
                        maxMinOrderPrice
                ));
            }

            if (StringUtils.hasText(cuisine)) {
                predicates.add(criteriaBuilder.equal(
                        criteriaBuilder.lower(root.get("restaurantCategory")),
                        cuisine.toLowerCase()
                ));
            }

            // --- Consolidated JOIN for Address and District ---
            Join<Restaurant, Address> addressJoin = null;
            Join<Address, District> districtJoin = null;

            // Only perform joins if either districtName or city filter is applied
            if (StringUtils.hasText(districtName) || city != null) {
                addressJoin = root.join("address", JoinType.INNER);
                districtJoin = addressJoin.join("district", JoinType.INNER);
            }


            // --- ADD DISTRICT NAME FILTERING LOGIC ---
            if (StringUtils.hasText(districtName)) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(districtJoin.get("name")), // Access District name
                        "%" + districtName.toLowerCase() + "%"
                ));
            }
            // --- ADD CITY ENUM FILTERING LOGIC ---
            if (city != null) { // Check if city enum is provided
                // Use the districtJoin to filter by the city associated with the district
                predicates.add(criteriaBuilder.equal(
                        districtJoin.get("city"), // Access District's city enum
                        city
                ));
            }
            if (customerAllergens != null && !customerAllergens.isEmpty()) {

                jakarta.persistence.criteria.Subquery<Long> safeMenuItemRestaurantSubquery = query.subquery(Long.class);
                jakarta.persistence.criteria.Root<MenuItem> menuItemRoot = safeMenuItemRestaurantSubquery.from(MenuItem.class);

                jakarta.persistence.criteria.Subquery<Long> menuItemsWithCustomerAllergensSubquery = query.subquery(Long.class);
                jakarta.persistence.criteria.Root<MenuItem> subMenuItemRoot = menuItemsWithCustomerAllergensSubquery.from(MenuItem.class);
                SetJoin<MenuItem, Allergens> subMenuItemAllergenJoin = subMenuItemRoot.joinSet("allergens");

                menuItemsWithCustomerAllergensSubquery.select(subMenuItemRoot.get("id"))
                        .where(subMenuItemAllergenJoin.in(customerAllergens)); // MenuItem contains an allergen the customer is allergic to.


                safeMenuItemRestaurantSubquery.select(menuItemRoot.get("restaurant").get("id")) // Select the Restaurant ID
                        .where(
                                criteriaBuilder.equal(menuItemRoot.get("restaurant").get("id"), root.get("id")),
                                criteriaBuilder.not(menuItemRoot.get("id").in(menuItemsWithCustomerAllergensSubquery))
                        );
                predicates.add(criteriaBuilder.exists(safeMenuItemRestaurantSubquery));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }


    public static Specification<Restaurant> nameContains(String name) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(criteriaBuilder.lower(root.get("restaurantName")), "%" + name.toLowerCase() + "%");
    }
    public static Specification<Restaurant> ratingGreaterThanOrEqualTo(Float rating) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.greaterThanOrEqualTo(root.get("rating"), rating);
    }
    // etc...
    // Then combine them in the service: Specification.where(nameContains(name)).and(ratingGreaterThanOrEqualTo(minRating))...
    // The combined method filterBy() shown above is often cleaner when parameters are optional.
}