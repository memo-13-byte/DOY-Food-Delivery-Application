package com.pingfloyd.doy.entities;

import com.pingfloyd.doy.enums.CardType;
import com.pingfloyd.doy.utils.YearMonthAttributeConverter;
import java.time.YearMonth;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "payment_info")
@Getter
@Setter
@NoArgsConstructor
public class PaymentInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_info_id")
    private Long id;

    @NotNull
    @Column(name = "cardholder_name", nullable = false, length = 100)
    private String cardholderName;

    @Enumerated(EnumType.STRING)
    @Column(name = "card_type", length = 50)
    private CardType cardType;

    @NotNull
    @Column(name = "last_four_digits", nullable = false, length = 4)
    private String lastFourDigits;

    @NotNull
    @Column(name = "expiry_date", nullable = false, length = 7)
    @Convert(converter = YearMonthAttributeConverter.class)
    private YearMonth expiryDate;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;
}
