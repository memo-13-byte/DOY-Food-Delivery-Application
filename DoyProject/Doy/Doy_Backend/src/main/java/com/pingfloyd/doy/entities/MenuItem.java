package com.pingfloyd.doy.entities;

import com.pingfloyd.doy.enums.Allergens;
import com.pingfloyd.doy.enums.MenuItemType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.util.Set;

@Entity
@Table(name = "menu_item")
@Getter
@Setter
@NoArgsConstructor
public class MenuItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "menu_item_id")
    private Long id;

    @NotNull
    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @NotNull
    @Column(name = "price", precision = 10, scale = 2, nullable = false)
    private BigDecimal price;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    @Column(name = "category", length = 50)
    private String category;

    @Enumerated
    @Column(name = "menu_item_type", length = 30, nullable = false)
    private MenuItemType menuItemType;

    @ElementCollection(targetClass = Allergens.class)
    @CollectionTable(
            name = "menu_item_allergens",
            joinColumns = @JoinColumn(name = "menu_item_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "allergen", length = 30)
    private Set<Allergens> allergens;


    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "image_id", referencedColumnName = "image_id")
    private Image image;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Restaurant restaurant;
}