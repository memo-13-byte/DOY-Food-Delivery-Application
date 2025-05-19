package com.pingfloyd.doy.entities;

import com.pingfloyd.doy.enums.ImageType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "image")
@Getter
@Setter
@NoArgsConstructor
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "image_id")
    private Long id;

    @Column(name = "type", nullable = false)
    ImageType imageType;

    public Image(ImageType imageType) {
        this.imageType = imageType;
    }
}
