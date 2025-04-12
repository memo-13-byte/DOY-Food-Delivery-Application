package com.pingfloyd.doy.other;

import com.pingfloyd.doy.entities.Restaurant;
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
            String cuisine) {

        // Root<T> root: Represents the entity (Restaurant)
        // CriteriaQuery<?> query: The query being built
        // CriteriaBuilder criteriaBuilder: Used to build predicates (where clauses, etc.)
        return (root, query, criteriaBuilder) -> {

            // Use a List to hold all the predicates (conditions)
            List<Predicate> predicates = new ArrayList<>();

            // 1. Filter by Name (Containing, IgnoreCase)
            if (StringUtils.hasText(name)) { // Check if name is not null and not empty/whitespace
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("restaurantName")), // field name from Restaurant entity
                        "%" + name.toLowerCase() + "%"
                ));
            }

            // 2. Filter by Rating (Greater Than or Equal To)
            if (minRating != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                        root.get("rating"), // field name from Restaurant entity
                        minRating
                ));
            }

            // 3. Filter by Min Order Price (Less Than or Equal To)
            if (maxMinOrderPrice != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                        root.get("minOrderPrice"), // field name from Restaurant entity
                        maxMinOrderPrice
                ));
            }

            // 4. Filter by Cuisine (Exact Match, IgnoreCase)
            if (StringUtils.hasText(cuisine)) {
                predicates.add(criteriaBuilder.equal(
                        criteriaBuilder.lower(root.get("cuisine")), // field name from Restaurant entity
                        cuisine.toLowerCase()
                ));
            }

            // Combine all predicates with AND
            // criteriaBuilder.and() takes an array of Predicate
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));

            // If no filters are applied, an empty predicate list results in "WHERE 1=1" essentially.
            // Alternatively, you could return criteriaBuilder.conjunction() for an "always true" predicate.
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