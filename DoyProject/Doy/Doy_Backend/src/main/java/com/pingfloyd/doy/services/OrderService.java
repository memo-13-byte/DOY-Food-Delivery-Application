package com.pingfloyd.doy.services;


import com.pingfloyd.doy.dto.DtoPaymentInformationIU;
import com.pingfloyd.doy.dto.UserCartDTO;
import com.pingfloyd.doy.entities.*;
import com.pingfloyd.doy.enums.CardType;
import com.pingfloyd.doy.enums.OrderStatus;
import com.pingfloyd.doy.exception.CartIsNotEmptyException;
import com.pingfloyd.doy.exception.ItemNotFoundException;
import com.pingfloyd.doy.exception.UserNotFoundException;
import com.pingfloyd.doy.repositories.CustomerOrderRepository;
import com.pingfloyd.doy.repositories.OrderItemRepository;
import com.pingfloyd.doy.repositories.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Set;

@Service
public class OrderService {
    private final ItemService itemService;
    private final UserService userService;
    private final CartService cartService;
    private final PaymentRepository paymentRepository;
    private final CustomerOrderRepository customerOrderRepository;
    private final OrderItemRepository orderItemRepository;

    @Autowired
    public OrderService(ItemService itemService, UserService userService, CartService cartService, PaymentRepository paymentRepository, CustomerOrderRepository customerOrderRepository, OrderItemRepository orderItemRepository){
        this.itemService = itemService;
        this.userService = userService;
        this.cartService = cartService;
        this.paymentRepository = paymentRepository;
        this.customerOrderRepository = customerOrderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    public Boolean AddItemToCart(String username, Long itemId) throws UserNotFoundException, ItemNotFoundException, CartIsNotEmptyException {
        Customer customer = userService.SearchCustomer(username);
        MenuItem menuItem = itemService.getItemById(itemId);
        CartItem _item = null;
        if(customer == null){
            throw new UserNotFoundException("User with given email doesn't exist!");
        }
        if(menuItem == null){
            throw new ItemNotFoundException("Menu item with given id doesn't exist!");
        }
            Cart userCart = customer.getCart();
            //If first time adding item create cart
            if(userCart == null){
                customer.setCart(cartService.CreateCart(customer , menuItem.getRestaurant()));
                userCart = customer.getCart();
            }
            //If cart is empty , add new item and bind cart to that restaurant
            if(userCart.getItems().isEmpty()){
                userCart.setRestaurant(menuItem.getRestaurant());
                userCart.getItems().add(cartService.CreateCartItem(userCart,menuItem));
                cartService.SaveCartItem(_item);
                cartService.SaveCart(userCart);
                return true;
            }

            //If item is not in cart and item restaurant is same as cart restaurant add item
            _item = TraverseCart(userCart , menuItem);
            if(_item == null && menuItem.getRestaurant() == userCart.getRestaurant()){
                _item = cartService.CreateCartItem(userCart , menuItem);
                userCart.getItems().add(_item);
            }
            else if(menuItem.getRestaurant() != userCart.getRestaurant()){
                //throw new CartIsNotEmptyException("Cart is not empty, you can not add items from other restaurants!");
                return false;
            }
            else{
                _item.setQuantity(_item.getQuantity()+1);
            }
            cartService.SaveCartItem(_item);
            cartService.SaveCart(userCart);
            return true;
    }
    public Boolean RemoveItemFromCart(String username , Long itemId) throws UserNotFoundException,ItemNotFoundException{
        Customer customer = userService.SearchCustomer(username);
        MenuItem menuItem = itemService.getItemById(itemId);
        if(customer == null){
            throw new UserNotFoundException("User with given email doesn't exist!");
        }
        if(menuItem == null){
            throw new ItemNotFoundException("Menu item with given id doesn't exist!");
        }
            Cart userCart = customer.getCart();
            if(userCart == null){
                //Throw exception
                return false;
            }
            CartItem item = TraverseCart(userCart , menuItem);
            if(item != null){
                item.setQuantity(item.getQuantity()-1);
                if(item.getQuantity() == 0){
                    userCart.getItems().remove(item);
                }
                cartService.SaveCartItem(item);
                cartService.SaveCart(userCart);
                return true;
            }
            return false;
    }
    public Boolean ConfirmCart(String username) throws UserNotFoundException{
        Customer customer = userService.SearchCustomer(username);
        if(customer != null && customer.getCart() != null){
            Cart cart = customer.getCart();
            Set<CartItem> set = cart.getItems();
            int price =0;
            for(CartItem item : set){
                price += item.getQuantity()*item.getMenuItem().getPrice().intValue();
            }
            return price >= cart.getRestaurant().getMinOrderPrice();
        }
        return false;
    }
    private CartItem TraverseCart(Cart cart , MenuItem menuItem){
        Set<CartItem> set = cart.getItems();
        for(CartItem item: set){
            if(item.getMenuItem() == menuItem){
                return item;
            }
        }
        return  null;
    }
    public Boolean ConfirmOrder(DtoPaymentInformationIU dtoPaymentInformationIU ,String username){
        Customer customer = userService.SearchCustomer(username);
        if(customer == null || dtoPaymentInformationIU == null){
            return false;
        }
        CustomerOrder customerOrder = CreateCustomerOrder(customer);
        customerOrderRepository.save(customerOrder);
        Set<CartItem> set = customer.getCart().getItems();
        for(CartItem item : set){
            orderItemRepository.save(CreateOrderItem(item,customerOrder));
        }
        paymentRepository.save(CreatePayment(dtoPaymentInformationIU , customer));
        return true;
    }
    private OrderItem CreateOrderItem(CartItem item , CustomerOrder customerOrder){
        OrderItem orderItem = new OrderItem();
        orderItem.setCustomerOrder(customerOrder);
        orderItem.setMenuItem(item.getMenuItem());
        return orderItem;
    }
    private CustomerOrder CreateCustomerOrder(Customer customer){
        CustomerOrder customerOrder = new CustomerOrder();
        customerOrder.setCustomer(customer);
        customerOrder.setStatus(OrderStatus.PLACED);
        customerOrder.setRestaurant(customer.getCart().getRestaurant());
        return customerOrder;
    }

   // public List<CustomerOrder>

    private PaymentInfo CreatePayment(DtoPaymentInformationIU dtoPaymentInformationIU, Customer customer){
        PaymentInfo paymentInfo = new PaymentInfo();
        paymentInfo.setCardholderName(dtoPaymentInformationIU.getNameOnCard());
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("MM-yy");
        paymentInfo.setExpiryDate(YearMonth.parse(dtoPaymentInformationIU.getExpiryDate() , dateTimeFormatter));
        paymentInfo.setLastFourDigits(dtoPaymentInformationIU.getLastFourDigits());
        paymentInfo.setCardType(CardType.MASTERCARD);
        paymentInfo.setCustomer(customer);
        return paymentInfo;
    }

    public UserCartDTO getCurrentUserCart(String username) throws UserNotFoundException{
        UserCartDTO cartDto = new UserCartDTO(); // Start with an empty DTO
        Customer customer = userService.SearchCustomer(username);
        if (customer == null) {
            throw new UserNotFoundException("User with given email doesn't exist!");
        }

        //String userEmail = principal.getName(); // Assuming email/username from Principal

        //Optional<Customer> customerOptional = customerRepository.findByEmail(userEmail); // Adapt method if needed
        Cart cart = customer.getCart();

        if (cart == null) {
            System.out.println("No cart entity associated with customer: " + username);
            return cartDto;
        }

        cartDto.setCartId(cart.getCartId());

        if (cart.getRestaurant() != null) {
            cartDto.setRestaurantId(cart.getRestaurant().getId());
            cartDto.setRestaurantName(cart.getRestaurant().getRestaurantName());
        } else {
            System.err.println("WARN: Cart " + cart.getCartId() + " is not linked to a Restaurant!");
        }


        if (cart.getItems() != null) {
            cart.getItems().forEach(cartItem -> {
                if (cartItem.getMenuItem() != null && cartItem.getQuantity() != null && cartItem.getQuantity() > 0) {
                    UserCartDTO.ItemInfo itemInfo = new UserCartDTO.ItemInfo();
                    itemInfo.setMenuItemId(cartItem.getMenuItem().getId());
                    itemInfo.setName(cartItem.getMenuItem().getName());
                    itemInfo.setPrice(cartItem.getMenuItem().getPrice());
                    itemInfo.setDescription(cartItem.getMenuItem().getDescription());
                    itemInfo.setQuantity(cartItem.getQuantity());
                    cartDto.getItems().add(itemInfo);
                } else {
                    System.err.println("WARN: Skipping invalid CartItem in cart " + cart.getCartId());
                }
            });
        }

        return cartDto;
    }


}
