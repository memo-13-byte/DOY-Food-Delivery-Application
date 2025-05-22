package com.pingfloyd.doy.other;

import com.pingfloyd.doy.entities.Address;
import com.pingfloyd.doy.entities.District;
import com.pingfloyd.doy.entities.Restaurant;
import com.pingfloyd.doy.enums.CityEnum;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate; // Use jakarta persistence
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils; // For checking empty strings

import java.util.ArrayList;
import java.util.List;

public class RestaurantSpecification {

    // Private constructor to prevent instantiation
    private RestaurantSpecification() {}

    /**
     * Creates a specification based on multiple optional filter criteria.
     *
     * @param name Optional: Part of the restaurant name (case-insensitive).
     * @param minRating Optional: Minimum acceptable rating.
     * @param maxMinOrderPrice Optional: Maximum acceptable minimum order price.
     * @param cuisine Optional: Exact cuisine type (case-insensitive).
     * @return A Specification object combining the active filters.
     */
    public static Specification<Restaurant> filterBy(
            String name,
            Float minRating,
            Double maxMinOrderPrice,
            String cuisine,
            String districtName,
            CityEnum city // <--- ADD THIS PARAMETER
    ) {

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // ... (existing filters for name, minRating, maxMinOrderPrice, cuisine) ...

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
            // ------------------------------------------

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }


    // --- You could also create individual specification methods if preferred ---
    // Example:
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