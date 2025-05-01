package com.pingfloyd.doy.services;


import com.pingfloyd.doy.dto.*;
import com.pingfloyd.doy.entities.*;
import com.pingfloyd.doy.enums.CardType;
import com.pingfloyd.doy.enums.OrderStatus;
import com.pingfloyd.doy.exception.*;
import com.pingfloyd.doy.repositories.CustomerOrderRepository;
import com.pingfloyd.doy.repositories.OrderItemRepository;
import com.pingfloyd.doy.repositories.PaymentRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class OrderService {
    private final ItemService itemService;
    private final UserService userService;
    private final CourierService courierService;
    private final RestaurantService restaurantService;
    private final CartService cartService;
    private final PaymentRepository paymentRepository;
    private final CustomerOrderRepository customerOrderRepository;
    private final CourierRequestService courierRequestService;
    private final DistrictService districtService;
    private final OrderItemRepository orderItemRepository;
    private final EmailService emailService;

    @Autowired
    public OrderService(ItemService itemService, UserService userService, CourierService courierService, RestaurantService restaurantService, CartService cartService, PaymentRepository paymentRepository, CustomerOrderRepository customerOrderRepository, CourierRequestService courierRequestService, DistrictService districtService, OrderItemRepository orderItemRepository, EmailService emailService){
        this.itemService = itemService;
        this.userService = userService;
        this.courierService = courierService;
        this.restaurantService = restaurantService;
        this.cartService = cartService;
        this.paymentRepository = paymentRepository;
        this.customerOrderRepository = customerOrderRepository;
        this.courierRequestService = courierRequestService;
        this.districtService = districtService;
        this.orderItemRepository = orderItemRepository;
        this.emailService = emailService;
    }

    public Boolean ClearCartByRestaurant(Long id){
        cartService.CleanCartRestaurant(id);
        return true;
    }

    @Transactional
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

    @Transactional
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
            if(price < cart.getRestaurant().getMinOrderPrice()){
                throw new MinOrderPriceNotMeetException("Price of current cart is lower than minimum order price!");
            }
            return true;
        }
        return false;
    }
    private CartItem TraverseCart(Cart cart , MenuItem menuItem){
        Set<CartItem> set = cart.getItems();
        for(CartItem item: set){
            if(item.getMenuItem().getId().equals(menuItem.getId())){
                return item;
            }
        }
        return  null;
    }

    @Transactional
    public Boolean ConfirmOrder(DtoPaymentInformationIU dtoPaymentInformationIU ,String username){
        Customer customer = userService.SearchCustomer(username);
        if(customer == null || dtoPaymentInformationIU == null){
            return false;
        }
        CustomerOrder customerOrder = CreateCustomerOrder(customer);
        Set<CartItem> set = customer.getCart().getItems();
        Double price = 0.0;
        for(CartItem item : set){
            OrderItem orderItem = CreateOrderItem(item,customerOrder);
            price +=  item.getMenuItem().getPrice().doubleValue();
            //orderItemRepository.save(orderItem);
            customerOrder.getItems().add(orderItem);
        }
        set.clear();
        customerOrder.setPrice(price);
        customerOrderRepository.save(customerOrder);
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
    public DtoRestaurantOrders GetRestaurantOrders(Long id){
        Restaurant restaurant = restaurantService.findRestaurantById(id);
        if(restaurant == null){
            throw new RestaurantNotFoundException("Restaurant with given id doesn't exist!");
        }
        List<CustomerOrder> orders = customerOrderRepository.findCustomerOrdersByRestaurant(restaurant);
        return MapOrders(orders);
    }
    public DtoRestaurantOrders GetCourierOrders(Long id){
        Optional<Courier> courier = courierService.GetCourierById(id);
        if(courier.isEmpty()){
            throw new UserNotFoundException("Courier with given id cannot be found");
        }
        List<CustomerOrder> orders = customerOrderRepository.findCustomerOrdersByCourier(courier.get());
        return MapOrders(orders);
    }

    public List<DtoCourierForOrder> GetAvailableCouriersByDistrict(Long restaurantId){
        Restaurant restaurant = restaurantService.findRestaurantById(restaurantId);
        District district = restaurant.getAddress().getDistrict();
        Set<Courier> couriers = courierService.GetCouriersByDistrict(district);
        List<DtoCourierForOrder> courierForOrderList = new ArrayList<>();
        for(Courier c : couriers){
            if(c.getIsAvailable()){
                DtoCourierForOrder dtoCourierForOrder = MapDtoCourierForOrder(c);
                courierForOrderList.add(dtoCourierForOrder);
            }
        }
        return courierForOrderList;
    }

    public Boolean SendRequestToCourier(Long orderId, Long courierId){
        Optional<CustomerOrder> order = customerOrderRepository.findCustomerOrderByOrderId(orderId);
        if(order.isEmpty()){
            throw new OrderNotFoundException("Order with given id cannot be found!");
        }
        Optional<Courier> courier = courierService.GetCourierById(courierId);
        if(courier.isEmpty()){
            throw new UserNotFoundException("Courier with given id doesn't exist!");
        }
        CourierRequest request = new CourierRequest();
        request.setCourier(courier.get());
        request.setOrder(order.get());
        courierRequestService.SaveRequest(request);
        return true;
    }

    public DtoCourierRequest GetCourierRequests(Long courierId){
        Optional<Courier> c = courierService.GetCourierById(courierId);
        if( c.isEmpty()){
            throw new UserNotFoundException("Courier with given id cannot be found");
        }
        List<CourierRequest> requests = courierRequestService.GetCourierRequests(courierId);
        DtoCourierRequest request = new DtoCourierRequest();
        for(CourierRequest req : requests){
            CustomerOrder order = req.getOrder();
            if(order.getStatus() != OrderStatus.PREPARED){
                continue;
            }
            Customer customer = order.getCustomer();
            DtoCourierRequest.RequestInfo requestInfo = new DtoCourierRequest.RequestInfo();
            for(OrderItem item : order.getItems()){
                DtoMenuItem dtoMenuItem = MapMenuItem(item.getMenuItem());
                requestInfo.getMenuItems().add(dtoMenuItem);
            }
            requestInfo.setOrderId(order.getOrderId());
            requestInfo.setNote("None");
            requestInfo.setRequestId(req.getRequestId());
            requestInfo.setCustomerEmail(customer.getEmail());
            //requestInfo.setCustomerAddress(MapAddress(customer.getCurrent_address()));
            requestInfo.setCustomerName(customer.getFirstname() + " " + customer.getLastname());
            requestInfo.setCustomerPhone(customer.getPhoneNumber());
            requestInfo.setRestaurantName(order.getRestaurant().getRestaurantName());
            request.getRequestInfos().add(requestInfo);
        }
        return request;
    }

    private DtoAddress MapAddress(Address address){
        DtoAddress dtoAddress = new DtoAddress();
        dtoAddress.setCity(address.getCityEnum());
        dtoAddress.setAvenue(address.getAvenue());
        dtoAddress.setDistrict(address.getDistrict().getName());
        dtoAddress.setStreet(address.getStreet());
        dtoAddress.setNeighborhood(address.getNeighborhood());
        dtoAddress.setApartmentNumber(Integer.valueOf(address.getApartment_number()));
        dtoAddress.setBuildingNumber(Integer.valueOf(address.getBuildingNumber()));
        return dtoAddress;
    }
    private DtoMenuItem MapMenuItem(MenuItem item){
        DtoMenuItem dtoMenuItem = new DtoMenuItem();
        dtoMenuItem.setRestaurantId(item.getRestaurant().getId());
        dtoMenuItem.setMenuItemType(item.getMenuItemType());
        dtoMenuItem.setName(item.getName());
        dtoMenuItem.setPrice(item.getPrice());
        dtoMenuItem.setId(item.getId());
        dtoMenuItem.setDescription(item.getDescription());
        return dtoMenuItem;
    }


    public DtoCourierForOrder MapDtoCourierForOrder(Courier c){
        DtoCourierForOrder dtoCourierForOrder = new DtoCourierForOrder();
        dtoCourierForOrder.setCourierId(c.getId());
        dtoCourierForOrder.setEmail(c.getEmail());
        dtoCourierForOrder.setLocation(c.getFirstname());
        dtoCourierForOrder.setFirstName(c.getFirstname());
        dtoCourierForOrder.setPhoneNumber(c.getPhoneNumber());
        dtoCourierForOrder.setLastName(c.getLastname());
        return dtoCourierForOrder;

    }

    public Boolean SetCourierAvailability(Long id , Boolean status){
        courierService.SetAvailability(id ,status);
        return status;
    }
    public Boolean GetCourierAvailability(Long id ){
        return courierService.GetCourierAvailability(id);
    }


    public Boolean CourierResponse(Long requestId , Boolean response){
        CourierRequest request = courierRequestService.GetCourierRequestById(requestId);
        CustomerOrder order = request.getOrder();
        if(order == null){
            throw new OrderNotFoundException("There are no order associated with this request");
        }
        if(order.getCourier() != null){
            courierRequestService.DeleteRequest(request);

            throw new OrderAlreadyTakenException("Order already accepted by another courier");
        }
        if(response){
            order.setStatus(OrderStatus.AWAITING_PICKUP);
            request.getCourier().setIsAvailable(false);
            request.getCourier().setIsOnDelivery(true);
            order.setCourier(request.getCourier());
            request.setAcceptedAt(LocalDateTime.now());
            customerOrderRepository.save(order);
            courierService.SaveCourier(request.getCourier());
            return true;
        }
        request.setRejectedAt(LocalDateTime.now());
        courierRequestService.DeleteRequest(request);
        return true;
    }

    public DtoRestaurantOrders GetCourierActiveOrder(Long id){
        Optional<Courier> courier = courierService.GetCourierById(id);
        if(courier.isEmpty()){
            throw new UserNotFoundException("Courier with given id doesn't exist!");
        }
        Optional<CustomerOrder> orderOptional = customerOrderRepository.findCustomerOrderByCourier(courier.get());

        DtoRestaurantOrders dtoRestaurantOrders = new DtoRestaurantOrders();
        if(orderOptional.isPresent()){
            CustomerOrder order = orderOptional.get();
            MapOrderInfo(dtoRestaurantOrders, order);
        }
        return dtoRestaurantOrders;
    }

    private void MapOrderInfo(DtoRestaurantOrders dtoRestaurantOrders, CustomerOrder order) {
        DtoRestaurantOrders.OrderInfo orderInfo = new DtoRestaurantOrders.OrderInfo();
        orderInfo.setOrderId(order.getOrderId());
        orderInfo.setCreationDate(order.getCreationDate());
        orderInfo.setCustomerName(order.getCustomer().getFirstname() + " " +order.getCustomer().getLastname());
        orderInfo.setCustomerPhone(order.getCustomer().getPhoneNumber());
        orderInfo.setPrice(order.getPrice());
        orderInfo.setStatus(order.getStatus());
        dtoRestaurantOrders.getOrderInfoList().add(orderInfo);
    }

    private DtoRestaurantOrders MapOrders(List<CustomerOrder> orders){
        DtoRestaurantOrders dtoRestaurantOrders = new DtoRestaurantOrders();
        for(CustomerOrder order : orders){
            MapOrderInfo(dtoRestaurantOrders, order);
        }
        return dtoRestaurantOrders;
    }


    @Transactional
    public void ProcessOrderState(Long id , DtoOrderStatus status){
        Optional<CustomerOrder> order = customerOrderRepository.findCustomerOrderByOrderId(id);
        if(order.isEmpty()){
            throw new OrderNotFoundException("Order with given id cannot be found!");
        }
        CustomerOrder customerOrder = order.get();
        if(status.getAccept()){
            customerOrder.setStatus(status.getStatus());
            if(status.getStatus() == OrderStatus.DELIVERED){
                customerOrder.getCourier().setIsOnDelivery(false);
                customerOrder.getCourier().setIsAvailable(true);
                customerOrder.setDeliveryDate(LocalDate.now());
                courierService.SaveCourier(customerOrder.getCourier());
            }
        }
        else{
            customerOrder.setStatus(OrderStatus.REJECTED);
        }
        customerOrderRepository.save(customerOrder);
    }

    @Transactional
    public void AssignCourierToOrder(Long courierId , Long orderId){
        Optional<Courier> courierOptional = courierService.GetCourierById(courierId);
        if(courierOptional.isEmpty()){
            throw new UserNotFoundException("Courier with given id cannot be found!");
        }
        if(!courierOptional.get().getIsAvailable()){
            throw new CourierIsNotAvailableException("Courier is not available for a new order!");
        }
        Optional<CustomerOrder> customerOrderOptional = customerOrderRepository.findCustomerOrderByOrderId(orderId);
        if(customerOrderOptional.isEmpty()){
            throw  new OrderNotFoundException("Order with given id cannot be found!");
        }
        customerOrderOptional.get().setCourier(courierOptional.get());
        customerOrderRepository.save(customerOrderOptional.get());
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

    public DtoOrderDetails GetOrderDetails(Long orderId){
        Optional<CustomerOrder> order1 = customerOrderRepository.findCustomerOrderByOrderId(orderId);
        if(order1.isEmpty()){
            throw new OrderNotFoundException("Order with given id cannot be found");
        }
        CustomerOrder order = order1.get();
        DtoOrderDetails request = new DtoOrderDetails();
        Customer customer = order.getCustomer();
        //DtoCourierRequest.RequestInfo requestInfo = new DtoCourierRequest.RequestInfo();
        for(OrderItem item : order.getItems()){
            DtoMenuItem dtoMenuItem = MapMenuItem(item.getMenuItem());
            request.getMenuItems().add(dtoMenuItem);
        }
            request.setOrderId(order.getOrderId());
            request.setNote("None");
            request.setCustomerEmail(customer.getEmail());
            request.setCustomerAddress(MapAddress(customer.getCurrent_address()));
            //requestInfo.setCustomerAddress(MapAddress(customer.getCurrent_address()));
            request.setCustomerName(customer.getFirstname() + " " + customer.getLastname());
            request.setCustomerPhone(customer.getPhoneNumber());
            request.setRestaurantName(order.getRestaurant().getRestaurantName());
        return request;
    }


}
