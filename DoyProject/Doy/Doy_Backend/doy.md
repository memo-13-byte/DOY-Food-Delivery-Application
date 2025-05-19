classDiagram
direction BT
class AccessDeniedExceptionHandler {
  + AccessDeniedExceptionHandler() 
  + handle(HttpServletRequest, HttpServletResponse, AccessDeniedException) void
}
class Address {
  + Address() 
  - String avenue
  - String neighborhood
  - String apartment_number
  - String buildingNumber
  - long addressID
  - CityEnum cityEnum
  - District district
  - String street
   String street
   District district
   String buildingNumber
   String neighborhood
   long addressID
   String apartment_number
   String avenue
   CityEnum cityEnum
}
class AddressRepository {
<<Interface>>

}
class ApiError~T~ {
  + ApiError(String, Date, T) 
  + ApiError() 
  - T errors
  - Date timestamp
  - String code
  + equals(Object) boolean
  # canEqual(Object) boolean
  + hashCode() int
  + toString() String
  + createApiError(T) ApiError~T~
   Date timestamp
   String code
   T errors
}
class AppConfig {
  + AppConfig() 
  + userDetailsService() UserDetailsService
  + bCryptPasswordEncoder() BCryptPasswordEncoder
  + authenticationProvider() AuthenticationProvider
  + jwtService() JwtService
  + authenticationManager(AuthenticationConfiguration) AuthenticationManager
}
class AuthenticationExceptionHandler {
  + AuthenticationExceptionHandler() 
  + commence(HttpServletRequest, HttpServletResponse, AuthenticationException) void
}
class Ban {
  + Ban() 
  - User user
  - LocalDateTime endDate
  - String description
  - LocalDateTime createdAt
  - Long userId
   String description
   Long userId
   LocalDateTime createdAt
   User user
   LocalDateTime endDate
}
class BanRepository {
<<Interface>>

}
class CardType {
<<enumeration>>
  + CardType() 
  + values() CardType[]
  + valueOf(String) CardType
}
class Cart {
  + Cart() 
  - Restaurant restaurant
  - Set~CartItem~ items
  - Long cartId
  - Customer customer
  - String status
  + removeItem(CartItem) void
  + addItem(MenuItem, int) void
   String status
   Set~CartItem~ items
   Customer customer
   Restaurant restaurant
   Long cartId
}
class CartIsNotEmptyException {
  + CartIsNotEmptyException(String) 
}
class CartItem {
  + CartItem() 
  - Long cartItemId
  - Cart cart
  - MenuItem menuItem
  - Integer quantity
   Cart cart
   Integer quantity
   MenuItem menuItem
   Long cartItemId
}
class CartItemRepository {
<<Interface>>

}
class CartRepository {
<<Interface>>
  + findCartsByRestaurant(Restaurant) List~Cart~
}
class CartService {
  + CartService(CartRepository, CartItemRepository, RestaurantOwnerService) 
  + CreateCart(Customer, Restaurant) Cart
  + CleanCartRestaurant(Long) void
  + CreateCartItem(Cart, MenuItem) CartItem
  + SaveCart(Cart) void
  + SaveCartItem(CartItem) void
}
class CityEnum {
<<enumeration>>
  + CityEnum() 
  + values() CityEnum[]
  + valueOf(String) CityEnum
}
class ConfirmationToken {
  + ConfirmationToken() 
  + ConfirmationToken(String, LocalDateTime, LocalDateTime, Boolean, User) 
  - Boolean confirmed
  - User user
  - LocalDateTime createdAt
  - Long id
  - LocalDateTime expiredAt
  - String token
   LocalDateTime createdAt
   String token
   Boolean confirmed
   Long id
   LocalDateTime expiredAt
   User user
}
class ConfirmationTokenRepository {
<<Interface>>
  + findConfirmationTokenByToken(String) Optional~ConfirmationToken~
}
class ConfirmationTokenService {
  + ConfirmationTokenService(ConfirmationTokenRepository) 
  + saveConfirmationToken(ConfirmationToken) void
  + getToken(String) Optional~ConfirmationToken~
  + GenerateToken(User, int) ConfirmationToken
  + confirmToken(String) User
}
class Courier {
  + Courier(String, String, String, String, String) 
  + Courier() 
  - Boolean isAvailable
  - District district
  - String governmentId
  - Boolean isBanned
   District district
   String governmentId
   Boolean isAvailable
   Boolean isBanned
}
class CourierIsNotAvailableException {
  + CourierIsNotAvailableException(String) 
}
class CourierRegistrationRequest {
  + CourierRegistrationRequest(String, String, String, String, String, String, String, CityEnum) 
  - String firstName
  - String password
  - String lastName
  - String phoneNumber
  - String governmentId
  - CityEnum city
  - String email
  - String name
  # canEqual(Object) boolean
  + equals(Object) boolean
  + hashCode() int
  + toString() String
   String name
   String password
   String lastName
   String email
   String phoneNumber
   String firstName
   CityEnum city
   String governmentId
}
class CourierRepository {
<<Interface>>
  + findByGovernmentId(String) Optional~Courier~
  + findCourierById(Long) Optional~Courier~
  + findCouriersByDistrictAndIsAvailableTrue(District) Set~Courier~
  + findCouriersByIsEnabledFalseAndIsBannedFalse() Set~Courier~
  + findByEmail(String) Optional~Courier~
  + findCourierByEmail(String) Optional~Courier~
  + findCouriersByDistrict(District) Set~Courier~
}
class CourierRequest {
  + CourierRequest(CustomerOrder) 
  + CourierRequest() 
  - Long requestId
  - Courier courier
  - LocalDateTime createdAt
  - LocalDateTime rejectedAt
  - CustomerOrder order
  - Integer estimatedDuration
  - Double estimatedDistance
  - LocalDateTime acceptedAt
  + acceptRequest(Courier) void
   Double estimatedDistance
   LocalDateTime createdAt
   CustomerOrder order
   LocalDateTime acceptedAt
   Courier courier
   Long requestId
   LocalDateTime rejectedAt
   Integer estimatedDuration
}
class CourierRequestNotFoundException {
  + CourierRequestNotFoundException(String) 
}
class CourierRequestRepository {
<<Interface>>
  + findCourierRequestsByCourier(Courier) List~CourierRequest~
  + findCourierRequestByRequestId(Long) Optional~CourierRequest~
}
class CourierRequestService {
  + CourierRequestService(CourierRequestRepository, CourierService) 
  + DeleteRequest(CourierRequest) void
  + SaveRequest(CourierRequest) void
  + GetCourierRequests(Long) List~CourierRequest~
  + GetCourierRequestById(Long) CourierRequest
}
class CourierService {
  + CourierService(CourierRepository) 
  + GetCourierById(Long) Optional~Courier~
  + GetAvailableCouriersByDistrict(District) Set~Courier~
  + GetByGovernmentId(String) Optional~Courier~
  + GetCouriersByDistrict(District) Set~Courier~
  + GetPendingCouriers() Set~Courier~
  + GetCourierAvailability(Long) Boolean
  + SetAvailability(Long, Boolean) void
}
class Customer {
  + Customer(String, String, String, String, String) 
  + Customer() 
  + Customer(String, String, String, String) 
  - Cart cart
  - Set~PaymentInfo~ paymentInfos
  - Set~Restaurant~ favoriteRestaurants
  - Set~Address~ addresses
  - Address current_address
  + addPaymentInfo(PaymentInfo) void
   Set~Address~ addresses
   Cart cart
   String password
   Set~Restaurant~ favoriteRestaurants
   Address current_address
   Set~PaymentInfo~ paymentInfos
}
class CustomerOrder {
  + CustomerOrder() 
  - Restaurant restaurant
  - Courier courier
  - LocalDate deliveryDate
  - LocalDate creationDate
  - Set~OrderItem~ items
  - Customer customer
  - Long orderId
  - OrderStatus status
  - Double price
   LocalDate creationDate
   OrderStatus status
   Set~OrderItem~ items
   LocalDate deliveryDate
   Long orderId
   Courier courier
   Double price
   Customer customer
   Restaurant restaurant
}
class CustomerOrderRepository {
<<Interface>>
  + findCustomerOrderByOrderId(Long) Optional~CustomerOrder~
  + findByCourierAndStatus(Courier, OrderStatus) List~CustomerOrder~
  + findCustomerOrdersByRestaurant(Restaurant) List~CustomerOrder~
  + findCustomerOrderByCourier(Courier) Optional~CustomerOrder~
}
class CustomerRepository {
<<Interface>>
  + findByEmail(String) Optional~Customer~
}
class Delivery {
  + Delivery() 
}
class District {
  + District() 
  - CityEnum city
  - Long districtId
  - Set~Courier~ couriers
  - String name
   Long districtId
   String name
   CityEnum city
   Set~Courier~ couriers
}
class DistrictRepository {
<<Interface>>
  + findByCityAndName(CityEnum, String) Optional~District~
}
class DistrictService {
  + DistrictService(DistrictRepository, AddressRepository) 
  + GetDistrict(CityEnum, String) District
  + SaveAddress(Address) Address
  + SaveDistrict(District) District
}
class DoyApplication {
  + DoyApplication() 
  + main(String[]) void
}
class DtoAddress {
  + DtoAddress(CityEnum, String, String, String, String, Integer, Integer) 
  + DtoAddress() 
  - Integer apartmentNumber
  - String street
  - Integer buildingNumber
  - String neighborhood
  - String district
  - CityEnum city
  - String avenue
  + hashCode() int
  + equals(Object) boolean
  + toString() String
  # canEqual(Object) boolean
   String street
   String neighborhood
   String district
   Integer apartmentNumber
   String avenue
   Integer buildingNumber
   CityEnum city
}
class DtoBanRequest {
  + DtoBanRequest() 
  - Long id
  - Integer banDuration
  - String description
   String description
   Long id
   Integer banDuration
}
class DtoCourier {
  + DtoCourier() 
  - String districtName
  - String governmentId
  - String districtCity
  + toString() String
  + equals(Object) boolean
  # canEqual(Object) boolean
  + hashCode() int
   String districtCity
   String districtName
   String governmentId
}
class DtoCourierForOrder {
  + DtoCourierForOrder() 
  - String email
  - String lastName
  - String firstName
  - String location
  - Long courierId
  - String phoneNumber
   String firstName
   String lastName
   String location
   Long courierId
   String email
   String phoneNumber
}
class DtoCourierIU {
  + DtoCourierIU() 
  - String districtCity
  - String districtName
  - String governmentId
  + toString() String
  + equals(Object) boolean
  # canEqual(Object) boolean
  + hashCode() int
   String districtCity
   String districtName
   String governmentId
}
class DtoCourierRequest {
  + DtoCourierRequest() 
  - List~RequestInfo~ requestInfos
   List~RequestInfo~ requestInfos
}
class DtoCustomer {
  + DtoCustomer() 
}
class DtoCustomerIU {
  + DtoCustomerIU() 
  + toString() String
  + equals(Object) boolean
  # canEqual(Object) boolean
  + hashCode() int
}
class DtoDistrict {
  + DtoDistrict() 
  - String district
  - CityEnum city
   CityEnum city
   String district
}
class DtoMenuItem {
  + DtoMenuItem(Long, String, String, BigDecimal, Long, MenuItemType) 
  + DtoMenuItem() 
  - String description
  - BigDecimal price
  - String name
  - Long restaurantId
  - Long id
  - MenuItemType menuItemType
  + hashCode() int
  + equals(Object) boolean
  # canEqual(Object) boolean
  + toString() String
   MenuItemType menuItemType
   String name
   String description
   Long restaurantId
   Long id
   BigDecimal price
}
class DtoMenuItemIU {
  + DtoMenuItemIU(String, String, BigDecimal, Long, MenuItemType) 
  + DtoMenuItemIU() 
  - String name
  - String description
  - Long restaurantId
  - MenuItemType menuItemType
  - BigDecimal price
  + toString() String
  + hashCode() int
  + equals(Object) boolean
  # canEqual(Object) boolean
   MenuItemType menuItemType
   String name
   String description
   Long restaurantId
   BigDecimal price
}
class DtoOrderAssignRequest {
  + DtoOrderAssignRequest() 
}
class DtoOrderDetails {
  + DtoOrderDetails() 
  - String customerName
  - List~DtoMenuItem~ menuItems
  - String restaurantName
  - DtoAddress customerAddress
  - String customerEmail
  - String note
  - Long orderId
  - String customerPhone
   String note
   String customerName
   Long orderId
   DtoAddress customerAddress
   String customerEmail
   String customerPhone
   List~DtoMenuItem~ menuItems
   String restaurantName
}
class DtoOrderStatus {
  + DtoOrderStatus() 
  - Boolean accept
  - OrderStatus status
   OrderStatus status
   Boolean accept
}
class DtoPayment {
  + DtoPayment() 
}
class DtoPaymentInformation {
  + DtoPaymentInformation() 
}
class DtoPaymentInformationIU {
  + DtoPaymentInformationIU(String, String, String, String, String, String, Integer, String, String, String, String, String) 
  + DtoPaymentInformationIU() 
  - String lastName
  - String lastFourDigits
  - String email
  - String cardNumber
  - String address
  - String notesForCourier
  - String phoneNumber
  - String firstName
  - String expiryDate
  - String cvv
  - Integer tip
  - String nameOnCard
  # canEqual(Object) boolean
  + hashCode() int
  + toString() String
  + equals(Object) boolean
   String lastFourDigits
   String cardNumber
   String lastName
   String email
   String phoneNumber
   String cvv
   Integer tip
   String notesForCourier
   String expiryDate
   String firstName
   String address
   String nameOnCard
}
class DtoPendingRegister {
  + DtoPendingRegister() 
  ~ List~UserInfo~ pendingUsers
   List~UserInfo~ pendingUsers
}
class DtoRestaurant {
  + DtoRestaurant(Long, String, String, String, RestaurantCategory, Double, Integer) 
  + DtoRestaurant() 
  - String description
  - Integer minOrderPrice
  - String restaurantName
  - Long id
  - RestaurantCategory restaurantCategory
  - String restaurantPhone
  - Double rating
  + toString() String
  + equals(Object) boolean
  + hashCode() int
  # canEqual(Object) boolean
   String description
   Long id
   Double rating
   Integer minOrderPrice
   String restaurantPhone
   String restaurantName
   RestaurantCategory restaurantCategory
}
class DtoRestaurantIU {
  + DtoRestaurantIU(String, String, String, RestaurantCategory, Double, Integer) 
  + DtoRestaurantIU() 
  - RestaurantCategory restaurantCategory
  - String restaurantName
  - Double rating
  - Integer minOrderPrice
  - String description
  - String restaurantPhone
  # canEqual(Object) boolean
  + toString() String
  + hashCode() int
  + equals(Object) boolean
   Double rating
   String description
   Integer minOrderPrice
   String restaurantPhone
   String restaurantName
   RestaurantCategory restaurantCategory
}
class DtoRestaurantOrders {
  + DtoRestaurantOrders() 
  ~ List~OrderInfo~ orderInfoList
   List~OrderInfo~ orderInfoList
}
class DtoRestaurantOwner {
  + DtoRestaurantOwner() 
  - String governmentId
  - Long restaurantId
  + toString() String
  + equals(Object) boolean
  # canEqual(Object) boolean
  + hashCode() int
   Long restaurantId
   String governmentId
}
class DtoRestaurantOwnerIU {
  + DtoRestaurantOwnerIU() 
  - String governmentId
  + toString() String
  + equals(Object) boolean
  # canEqual(Object) boolean
  + hashCode() int
   String governmentId
}
class DtoUser {
  + DtoUser() 
  + DtoUser(Long, String, String, String, String, UserRoles) 
  - String firstname
  - String phoneNumber
  - String email
  - Long id
  - String lastname
  - UserRoles role
  + toString() String
  + hashCode() int
  + equals(Object) boolean
  # canEqual(Object) boolean
   String firstname
   UserRoles role
   Long id
   String email
   String lastname
   String phoneNumber
}
class DtoUserIU {
  + DtoUserIU(String, String, String, String, UserRoles) 
  + DtoUserIU() 
  - String phoneNumber
  - String email
  - String firstname
  - String lastname
  - UserRoles role
  + equals(Object) boolean
  + toString() String
  + hashCode() int
  # canEqual(Object) boolean
   String firstname
   UserRoles role
   String email
   String lastname
   String phoneNumber
}
class EmailService {
  + EmailService(JavaMailSender) 
  + send(String, String, String) void
}
class GlobalExceptionHandler {
  + GlobalExceptionHandler() 
  + handleInvalidLoginAttemptException(InvalidLoginAttemptException) ResponseEntity~ApiError~
  + handleUserAlreadyExistException(UserAlreadyExistException) ResponseEntity~ApiError~
  + handleCartIsNotEmptyException(UserNotFoundException) ResponseEntity~ApiError~
  + handleOrderNotFoundException(OrderNotFoundException) ResponseEntity~ApiError~
  + handleRestaurantNotFoundException(RestaurantNotFoundException) ResponseEntity~ApiError~
  + handleUserNotFoundException(UserNotFoundException) ResponseEntity~ApiError~
  + handleItemNotFoundException(ItemNotFoundException) ResponseEntity~ApiError~
  + handleCourierIsNotAvailableException(CourierIsNotAvailableException) ResponseEntity~ApiError~
  + handleMethodArgumentNotValidException(MethodArgumentNotValidException) ResponseEntity~ApiError~
  + handleMinOrderPriceNotMeetException(MinOrderPriceNotMeetException) ResponseEntity~ApiError~
  + handleItemNotFoundException(CourierRequestNotFoundException) ResponseEntity~ApiError~
}
class GovernmentId {
  + GovernmentId() 
  - String idNumber
  - Long gid
   String idNumber
   Long gid
}
class IItemController {
<<Interface>>
  + getItem(Long) ResponseEntity~DtoMenuItem~
  + updateItem(Long, DtoMenuItemIU) ResponseEntity~DtoMenuItem~
  + postItem(DtoMenuItemIU) ResponseEntity~DtoMenuItem~
  + deleteItem(Long) ResponseEntity~DtoMenuItem~
  + getRestaurantItems(Long) ResponseEntity~List~DtoMenuItem~~
}
class IItemService {
<<Interface>>
  + getRestaurantItems(Long) List~DtoMenuItem~
  + deleteItem(Long) DtoMenuItem
  + updateItem(Long, DtoMenuItemIU) DtoMenuItem
  + postItem(DtoMenuItemIU) DtoMenuItem
  + getItem(Long) DtoMenuItem
}
class IPaymentController {
<<Interface>>
  + postPaymentInformation(DtoPaymentInformationIU) ResponseEntity~DtoPaymentInformation~
  + deletePaymentInformation(Long) ResponseEntity~DtoPaymentInformation~
  + getPaymentInformation(Long) ResponseEntity~DtoPaymentInformation~
}
class IPaymentService {
<<Interface>>
  + deletePaymentInformation(Long) DtoPaymentInformation
  + postPaymentInformation(DtoPaymentInformationIU) DtoPaymentInformation
  + getPaymentInformation(Long) DtoPaymentInformation
}
class IRestaurantController {
<<Interface>>
  + postRestaurant(DtoRestaurantIU) ResponseEntity~DtoRestaurant~
  + getRestaurant(Long) ResponseEntity~DtoRestaurant~
  + updateRestaurant(Long, DtoRestaurantIU) ResponseEntity~DtoRestaurant~
  + deleteRestaurant(Long) ResponseEntity~DtoRestaurant~
   ResponseEntity~List~DtoRestaurant~~ allRestaurants
}
class IRestaurantService {
<<Interface>>
  + deleteRestaurant(Long) DtoRestaurant
  + getRestaurant(Long) DtoRestaurant
  + gelAllRestaurants() List~DtoRestaurant~
  + postRestaurant(DtoRestaurantIU) DtoRestaurant
  + updateRestaurant(Long, DtoRestaurantIU) DtoRestaurant
}
class IUserController {
<<Interface>>
  + putCourier(String, DtoCourierIU) ResponseEntity~DtoCourier~
  + putCustomer(String, DtoCustomerIU) ResponseEntity~DtoCustomer~
  + getCustomerByEmail(String) ResponseEntity~DtoCustomer~
  + getCourierByEmail(String) ResponseEntity~DtoCourier~
  + getUserById(Long) ResponseEntity~DtoUser~
  + getRestaurantOwnerByEmail(String) ResponseEntity~DtoRestaurantOwner~
  + getUserByEmail(String) ResponseEntity~DtoUser~
  + putRestaurantOwner(String, DtoRestaurantOwnerIU) ResponseEntity~DtoRestaurantOwner~
   ResponseEntity~List~DtoUser~~ allUsers
   ResponseEntity~List~DtoRestaurantOwner~~ allRestaurantOwners
   ResponseEntity~List~DtoCustomer~~ allCustomers
   ResponseEntity~List~DtoCourier~~ allCouriers
}
class IUserService {
<<Interface>>
  + putCustomer(String, DtoCustomerIU) DtoCustomer
  + putRestaurantOwner(String, DtoRestaurantOwnerIU) DtoRestaurantOwner
  + getUserByEmail(String) DtoUser
  + getCourierByEmail(String) DtoCourier
  + getCustomerByEmail(String) DtoCustomer
  + getRestaurantOwnerByEmail(String) DtoRestaurantOwner
  + putCourier(String, DtoCourierIU) DtoCourier
  + getUserById(Long) DtoUser
   List~DtoCourier~ allCouriers
   List~DtoCustomer~ allCustomers
   List~DtoRestaurantOwner~ allRestaurantOwners
   List~DtoUser~ allUsers
}
class InvalidLoginAttemptException {
  + InvalidLoginAttemptException(String) 
}
class ItemController {
  + ItemController() 
  + getItem(Long) ResponseEntity~DtoMenuItem~
  + updateItem(Long, DtoMenuItemIU) ResponseEntity~DtoMenuItem~
  + postItem(DtoMenuItemIU) ResponseEntity~DtoMenuItem~
  + getRestaurantItems(Long) ResponseEntity~List~DtoMenuItem~~
  + deleteItem(Long) ResponseEntity~DtoMenuItem~
}
class ItemInfo {
  + ItemInfo() 
  - int quantity
  - Long menuItemId
  - String name
  - String description
  - BigDecimal price
   String name
   String description
   BigDecimal price
   Long menuItemId
   int quantity
}
class ItemNotFoundException {
  + ItemNotFoundException(String) 
}
class ItemRepository {
<<Interface>>
  + findMenuItemsByRestaurantId(Long) List~MenuItem~
}
class ItemService {
  + ItemService() 
  + postItem(DtoMenuItemIU) DtoMenuItem
  + deleteItem(Long) DtoMenuItem
  + getItemById(Long) MenuItem
  + getRestaurantItems(Long) List~DtoMenuItem~
  + getItem(Long) DtoMenuItem
  + updateItem(Long, DtoMenuItemIU) DtoMenuItem
}
class JwtAuthFilter {
  + JwtAuthFilter() 
  # doFilterInternal(HttpServletRequest, HttpServletResponse, FilterChain) void
}
class JwtService {
  + JwtService() 
  + exportToken(String, Function~Claims, T~) T
  + getClaimsFromToken(String) Claims
  + generateTokenForUser(UserDetails) String
  + getClaimFromToken(String, String) Object
  + getUsernameFromToken(String) String
  + isTokenExpired(String) boolean
   Key key
}
class LoginAuthResponse {
  + LoginAuthResponse(String, String) 
  + LoginAuthResponse() 
  ~ String email
  ~ String token
  + equals(Object) boolean
  # canEqual(Object) boolean
  + hashCode() int
  + toString() String
   String email
   String token
}
class LoginController {
  + LoginController() 
  + login(LoginRequest) LoginAuthResponse
}
class LoginRequest {
  + LoginRequest(String, String) 
  + LoginRequest() 
  - String username
  - String password
  + equals(Object) boolean
  # canEqual(Object) boolean
  + hashCode() int
  + toString() String
   String password
   String username
}
class LoginService {
  + LoginService() 
  + login(LoginRequest) LoginAuthResponse
}
class MenuItem {
  + MenuItem() 
  - String description
  - Restaurant restaurant
  - Long id
  - String category
  - String name
  - BigDecimal price
  - MenuItemType menuItemType
   String name
   String description
   Long id
   MenuItemType menuItemType
   Restaurant restaurant
   String category
   BigDecimal price
}
class MenuItemType {
<<enumeration>>
  + MenuItemType() 
  + valueOf(String) MenuItemType
  + values() MenuItemType[]
}
class MinOrderPriceNotMeetException {
  + MinOrderPriceNotMeetException(String) 
}
class OrderController {
  + OrderController(OrderService) 
  + GetActiveCouriers(Long) ResponseEntity~List~DtoCourierForOrder~~
  + testUser() String
  + AddItemToCart(Long) ResponseEntity~Boolean~
  + SetCourierAvailability(Long, Boolean) ResponseEntity~Boolean~
  + GetOrderDetails(Long) ResponseEntity~DtoOrderDetails~
  + processOrderState(Long, DtoOrderStatus) ResponseEntity~Void~
  + CourierResponse(Long, Boolean) ResponseEntity~Boolean~
  + GetCourierRequests(Long) ResponseEntity~DtoCourierRequest~
  + ConfirmCart() ResponseEntity~Boolean~
  + GetCourierAvailability(Long) ResponseEntity~Boolean~
  + RemoveItemFromCart(Long) ResponseEntity~Boolean~
  + ClearCartByRestaurant(Long) ResponseEntity~Boolean~
  + SendRequestToCourier(Long, Long) ResponseEntity~Boolean~
  + GetRestaurantOrders(Long) ResponseEntity~DtoRestaurantOrders~
  + ConfirmOrder(DtoPaymentInformationIU) ResponseEntity~Boolean~
   ResponseEntity~UserCartDTO~ customerCart
}
class OrderInfo {
  + OrderInfo() 
  - String customerName
  - Long orderId
  - String customerPhone
  - Long customerId
  - OrderStatus status
  - LocalDate creationDate
  - Double price
   LocalDate creationDate
   OrderStatus status
   String customerName
   Long orderId
   Long customerId
   String customerPhone
   Double price
}
class OrderItem {
  + OrderItem() 
  - Long orderItemId
  - CustomerOrder customerOrder
  - MenuItem menuItem
   CustomerOrder customerOrder
   MenuItem menuItem
   Long orderItemId
}
class OrderItemRepository {
<<Interface>>

}
class OrderNotFoundException {
  + OrderNotFoundException(String) 
}
class OrderService {
  + OrderService(ItemService, UserService, CourierService, RestaurantService, CartService, PaymentRepository, CustomerOrderRepository, CourierRequestService, DistrictService, OrderItemRepository, EmailService) 
  + GetRestaurantOrders(Long) DtoRestaurantOrders
  + CourierResponse(Long, Boolean) Boolean
  + ClearCartByRestaurant(Long) Boolean
  + AddItemToCart(String, Long) Boolean
  + GetCourierActiveOrder(Long) DtoRestaurantOrders
  - MapOrderInfo(DtoRestaurantOrders, CustomerOrder) void
  + AssignCourierToOrder(Long, Long) void
  + ProcessOrderState(Long, DtoOrderStatus) void
  + getCurrentUserCart(String) UserCartDTO
  + ConfirmOrder(DtoPaymentInformationIU, String) Boolean
  + GetCourierAvailability(Long) Boolean
  - MapAddress(Address) DtoAddress
  + GetCourierRequests(Long) DtoCourierRequest
  - CreateOrderItem(CartItem, CustomerOrder) OrderItem
  + SendRequestToCourier(Long, Long) Boolean
  - TraverseCart(Cart, MenuItem) CartItem?
  + RemoveItemFromCart(String, Long) Boolean
  + MapDtoCourierForOrder(Courier) DtoCourierForOrder
  + GetAvailableCouriersByDistrict(Long) List~DtoCourierForOrder~
  + GetOrderDetails(Long) DtoOrderDetails
  + ConfirmCart(String) Boolean
  - CreateCustomerOrder(Customer) CustomerOrder
  + SetCourierAvailability(Long, Boolean) Boolean
  - CreatePayment(DtoPaymentInformationIU, Customer) PaymentInfo
  - MapMenuItem(MenuItem) DtoMenuItem
  - MapOrders(List~CustomerOrder~) DtoRestaurantOrders
}
class OrderStatus {
<<enumeration>>
  + OrderStatus() 
  + valueOf(String) OrderStatus
  + values() OrderStatus[]
}
class PaymentController {
  + PaymentController() 
  + postPaymentInformation(DtoPaymentInformationIU) ResponseEntity~DtoPaymentInformation~
  + getPaymentInformation(Long) ResponseEntity~DtoPaymentInformation~
  + deletePaymentInformation(Long) ResponseEntity~DtoPaymentInformation~
}
class PaymentInfo {
  + PaymentInfo() 
  - Customer customer
  - Long id
  - YearMonth expiryDate
  - CardType cardType
  - String lastFourDigits
  - String cardholderName
   String lastFourDigits
   CardType cardType
   Customer customer
   Long id
   YearMonth expiryDate
   String cardholderName
}
class PaymentRepository {
<<Interface>>

}
class PaymentService {
  + PaymentService() 
  + postPaymentInformation(DtoPaymentInformationIU) DtoPaymentInformation
  + deletePaymentInformation(Long) DtoPaymentInformation
  + getPaymentInformation(Long) DtoPaymentInformation
}
class RegistrationController {
  + RegistrationController(RegistrationService) 
  + PendingRegister(Long, Boolean) ResponseEntity~Boolean~
  + confirmUserAccount(String) ResponseEntity~String~
  + register(RegistrationRequest) ResponseEntity~?~
  + CourierRegister(CourierRegistrationRequest) ResponseEntity~?~
  + restourantOwnerRegister(RestaurantOwnerFullDto) ResponseEntity~?~
}
class RegistrationRequest {
  + RegistrationRequest(String, String, String, String, String) 
  - String email
  - String lastName
  - String firstName
  - String password
  - String phoneNumber
  + equals(Object) boolean
  # canEqual(Object) boolean
  + hashCode() int
  + toString() String
   String password
   String firstName
   String lastName
   String email
   String phoneNumber
}
class RegistrationService {
  + RegistrationService(UserService, EmailService, ConfirmationTokenService, DistrictService, RestaurantOwnerService, CourierService) 
  - UserService userService
  - ConfirmationTokenService confirmationTokenService
  - EmailService emailService
  - String confirmUrlBase
  - DistrictService districtService
  - RestaurantOwnerService restaurantOwnerService
  - CourierService courierService
  + equals(Object) boolean
  # canEqual(Object) boolean
  + hashCode() int
  + toString() String
  - CreateCourier(CourierRegistrationRequest) Courier
  - BuildAcceptEmail(String) String
  + CourierRegister(CourierRegistrationRequest) Courier
  - buildEmail(String, String) String
  + confirmToken(String) String
  - CreateRestaurant(DtoRestaurantIU, RestaurantOwner) Restaurant
  - SendAcceptEmail(User) void
  - SendRejectionEmail(User) void
  - CreateRestaurantOwner(RestaurantOwnerRegistrationRequest) RestaurantOwner
  - BuildRejectEmail(String) String
  + CustomerRegister(RegistrationRequest) Customer
  - CreateAddress(DtoAddress) Address
  + RestaurantOwnerRegister(RestaurantOwnerRegistrationRequest, DtoRestaurantIU, DtoAddress) RestaurantOwner
  + EnableUser(Long, Boolean) Boolean
  - buildInformationEmail(String) String
   CourierService courierService
   DistrictService districtService
   ConfirmationTokenService confirmationTokenService
   EmailService emailService
   UserService userService
   RestaurantOwnerService restaurantOwnerService
   String confirmUrlBase
}
class RequestInfo {
  + RequestInfo() 
  - String customerPhone
  - String customerEmail
  - String restaurantName
  - Long orderId
  - String note
  - Long requestId
  - List~DtoMenuItem~ menuItems
  - DtoAddress customerAddress
  - String customerName
   String note
   String customerName
   Long orderId
   DtoAddress customerAddress
   String customerEmail
   String customerPhone
   Long requestId
   List~DtoMenuItem~ menuItems
   String restaurantName
}
class Restaurant {
  + Restaurant() 
  + Restaurant(String) 
  + Restaurant(String, String) 
  - RestaurantOwner restaurantOwner
  - Double rating
  - String restaurantPhone
  - String restaurantName
  - Set~MenuItem~ menuItems
  - Set~CustomerOrder~ orders
  - String description
  - Address address
  - Long id
  - Integer minOrderPrice
  - RestaurantCategory restaurantCategory
   String description
   Set~CustomerOrder~ orders
   Long id
   Set~MenuItem~ menuItems
   Double rating
   RestaurantOwner restaurantOwner
   Integer minOrderPrice
   Address address
   String restaurantPhone
   String restaurantName
   RestaurantCategory restaurantCategory
}
class RestaurantCategory {
<<enumeration>>
  + RestaurantCategory() 
  + values() RestaurantCategory[]
  + valueOf(String) RestaurantCategory
}
class RestaurantController {
  + RestaurantController() 
  + updateRestaurant(Long, DtoRestaurantIU) ResponseEntity~DtoRestaurant~
  + getRestaurant(Long) ResponseEntity~DtoRestaurant~
  + deleteRestaurant(Long) ResponseEntity~DtoRestaurant~
  + postRestaurant(DtoRestaurantIU) ResponseEntity~DtoRestaurant~
   ResponseEntity~List~DtoRestaurant~~ allRestaurants
}
class RestaurantNotFoundException {
  + RestaurantNotFoundException(String) 
}
class RestaurantOwner {
  + RestaurantOwner(String, String, String, String, String) 
  + RestaurantOwner() 
  - String governmentId
  - Restaurant restaurant
  - Boolean isBanned
   String governmentId
   Restaurant restaurant
   Boolean isBanned
}
class RestaurantOwnerFullDto {
  + RestaurantOwnerFullDto(RestaurantOwnerRegistrationRequest, DtoRestaurantIU, DtoAddress) 
  + RestaurantOwnerFullDto() 
  - RestaurantOwnerRegistrationRequest userInfo
  - DtoRestaurantIU restaurantInfo
  - DtoAddress addressInfo
  + toString() String
  + equals(Object) boolean
  # canEqual(Object) boolean
  + hashCode() int
   DtoAddress addressInfo
   DtoRestaurantIU restaurantInfo
   RestaurantOwnerRegistrationRequest userInfo
}
class RestaurantOwnerRegistrationRequest {
  + RestaurantOwnerRegistrationRequest(String, String, String, String, String, String) 
  - String governmentId
  - String password
  - String lastName
  - String email
  - String firstName
  - String phoneNumber
  + equals(Object) boolean
  # canEqual(Object) boolean
  + hashCode() int
  + toString() String
   String password
   String firstName
   String lastName
   String email
   String phoneNumber
   String governmentId
}
class RestaurantOwnerRepository {
<<Interface>>
  + findByEmail(String) Optional~RestaurantOwner~
  + findByGovernmentId(String) Optional~RestaurantOwner~
  + findRestaurantOwnersByIsEnabledFalseAndIsBannedFalse() Set~RestaurantOwner~
}
class RestaurantOwnerService {
  + RestaurantOwnerService(RestaurantOwnerRepository) 
  + GetByGovernmentId(String) Optional~RestaurantOwner~
  + GetPendingRestaurantOwners() Set~RestaurantOwner~
  + GetOwnerById(Long) Optional~RestaurantOwner~
}
class RestaurantRepository {
<<Interface>>
  + findByRestaurantNameContainingIgnoreCase(String, Pageable) List~Restaurant~
}
class RestaurantRequest {
  + RestaurantRequest() 
  + RestaurantRequest(Restaurant) 
  - Double rating
  - Integer minOrderPrice
  - String restaurantPhone
  - Long id
  - String restaurantName
  - RestaurantCategory restaurantCategory
  + hashCode() int
  + toString() String
  + equals(Object) boolean
  # canEqual(Object) boolean
   Double rating
   Integer minOrderPrice
   Long id
   String restaurantPhone
   String restaurantName
   RestaurantCategory restaurantCategory
}
class RestaurantSearchController {
  + RestaurantSearchController(RestaurantSearchService) 
  + searchRestaurants(String, Float, Double, String, int, int, String, String) ResponseEntity~Page~RestaurantRequest~~
}
class RestaurantSearchService {
  + RestaurantSearchService(RestaurantRepository) 
  + searchRestaurants(String, Float, Double, String, int, int, String, String) Page~RestaurantRequest~
   List~RestaurantRequest~ allRestaurants
}
class RestaurantService {
  + RestaurantService() 
  + getRestaurant(Long) DtoRestaurant
  + SaveRestaurant(Restaurant) void
  + postRestaurant(DtoRestaurantIU) DtoRestaurant
  + findRestaurantById(Long) Restaurant
  + deleteRestaurant(Long) DtoRestaurant
  + gelAllRestaurants() List~DtoRestaurant~
  + updateRestaurant(Long, DtoRestaurantIU) DtoRestaurant
}
class RestaurantSpecification {
  - RestaurantSpecification() 
  + filterBy(String, Float, Double, String) Specification~Restaurant~
  + ratingGreaterThanOrEqualTo(Float) Specification~Restaurant~
  + nameContains(String) Specification~Restaurant~
}
class SecurityConfig {
  + SecurityConfig(AuthenticationProvider) 
  + jwtAuthFilter() JwtAuthFilter
  + securityFilterChain(HttpSecurity) SecurityFilterChain
}
class SuspensionService {
  + SuspensionService(BanRepository) 
  + SaveBanRequest(Ban) void
  + RemoveBan(Ban) void
}
class User {
  # User(String, String, String, String, String) 
  + User() 
  # User(String, String, String, String) 
  - Boolean isEnabled
  - String lastname
  - String passwordHash
  - String firstname
  - UserRoles role
  - Long id
  - LocalDateTime createdAt
  - String email
  - String phoneNumber
   LocalDateTime createdAt
   Long id
   Collection~GrantedAuthority~ authorities
   UserRoles role
   String passwordHash
   String password
   String email
   String lastname
   String phoneNumber
   String firstname
   String username
   Boolean isEnabled
   boolean enabled
}
class UserAlreadyExistException {
  + UserAlreadyExistException(String) 
}
class UserCartDTO {
  + UserCartDTO() 
  - Long restaurantId
  - Long cartId
  - List~ItemInfo~ items
  - String restaurantName
   Long restaurantId
   List~ItemInfo~ items
   String restaurantName
   Long cartId
}
class UserController {
  + UserController() 
  + getCourierByEmail(String) ResponseEntity~DtoCourier~
  + getUserById(Long) ResponseEntity~DtoUser~
  + getUserByEmail(String) ResponseEntity~DtoUser~
  + putCustomer(String, DtoCustomerIU) ResponseEntity~DtoCustomer~
  + putCourier(String, DtoCourierIU) ResponseEntity~DtoCourier~
  + putRestaurantOwner(String, DtoRestaurantOwnerIU) ResponseEntity~DtoRestaurantOwner~
  + SuspendUser(DtoBanRequest) ResponseEntity~Boolean~
  + getRestaurantOwnerByEmail(String) ResponseEntity~DtoRestaurantOwner~
  + getCustomerByEmail(String) ResponseEntity~DtoCustomer~
  + GetPendingRegisters() ResponseEntity~DtoPendingRegister~
   ResponseEntity~List~DtoUser~~ allUsers
   ResponseEntity~List~DtoRestaurantOwner~~ allRestaurantOwners
   ResponseEntity~List~DtoCustomer~~ allCustomers
   ResponseEntity~List~DtoCourier~~ allCouriers
}
class UserInfo {
  + UserInfo() 
  - String name
  - UserRoles role
  - Long id
   UserRoles role
   String name
   Long id
}
class UserNotFoundException {
  + UserNotFoundException(String) 
}
class UserRepository {
<<Interface>>
  + existsByPhoneNumber(String) Boolean
  + findByEmail(String) Optional~User~
  + existsByEmail(String) Boolean
}
class UserRoles {
<<enumeration>>
  - UserRoles(String) 
  + values() UserRoles[]
  + valueOf(String) UserRoles
}
class UserService {
  + UserService(UserRepository, CustomerRepository, BCryptPasswordEncoder, CourierRepository, RestaurantOwnerRepository, SuspensionService) 
  + DeleteUser(User) void
  + SignUpCustomer(User, UserRoles) String
  + getCourierByEmail(String) DtoCourier
  + putCustomer(String, DtoCustomerIU) DtoCustomer
  + SuspendUser(DtoBanRequest) Boolean
  + getCustomerByEmail(String) DtoCustomer
  + getRestaurantOwnerByEmail(String) DtoRestaurantOwner
  + putRestaurantOwner(String, DtoRestaurantOwnerIU) DtoRestaurantOwner
  + loadUserByUsername(String) UserDetails
  + GetPendingRegisters() DtoPendingRegister
  + FindUserById(Long) Optional~User~
  + loadUserByEmail(String) Optional~User~
  + SaveUser(User) void
  + putCourier(String, DtoCourierIU) DtoCourier
  + SearchCustomer(String) Customer
  + getUserByEmail(String) DtoUser
  + getUserById(Long) DtoUser
   List~DtoCourier~ allCouriers
   List~DtoCustomer~ allCustomers
   List~DtoRestaurantOwner~ allRestaurantOwners
   List~DtoUser~ allUsers
}
class YearMonthAttributeConverter {
  + YearMonthAttributeConverter() 
  + convertToDatabaseColumn(YearMonth) String
  + convertToEntityAttribute(String) YearMonth
}

Address "1" *--> "cityEnum 1" CityEnum 
Address "1" *--> "district 1" District 
AppConfig  ..>  JwtService : «create»
AppConfig "1" *--> "userRepository 1" UserRepository 
Ban "1" *--> "user 1" User 
Cart "1" *--> "items *" CartItem 
Cart  ..>  CartItem : «create»
Cart "1" *--> "customer 1" Customer 
Cart "1" *--> "restaurant 1" Restaurant 
CartItem "1" *--> "cart 1" Cart 
CartItem "1" *--> "menuItem 1" MenuItem 
CartService  ..>  Cart : «create»
CartService  ..>  CartItem : «create»
CartService "1" *--> "cartItemRepository 1" CartItemRepository 
CartService "1" *--> "cartRepository 1" CartRepository 
CartService  ..>  RestaurantNotFoundException : «create»
CartService "1" *--> "restaurantOwnerService 1" RestaurantOwnerService 
ConfirmationToken "1" *--> "user 1" User 
ConfirmationTokenService  ..>  ConfirmationToken : «create»
ConfirmationTokenService "1" *--> "confirmationTokenRepository 1" ConfirmationTokenRepository 
Courier "1" *--> "district 1" District 
Courier  -->  User 
CourierRegistrationRequest "1" *--> "city 1" CityEnum 
CourierRequest "1" *--> "courier 1" Courier 
CourierRequest "1" *--> "order 1" CustomerOrder 
CourierRequestService  ..>  CourierRequestNotFoundException : «create»
CourierRequestService "1" *--> "courierRequestRepository 1" CourierRequestRepository 
CourierRequestService "1" *--> "courierService 1" CourierService 
CourierRequestService  ..>  UserNotFoundException : «create»
CourierService "1" *--> "courierRepository 1" CourierRepository 
CourierService  ..>  UserNotFoundException : «create»
Customer "1" *--> "addresses *" Address 
Customer "1" *--> "cart 1" Cart 
Customer "1" *--> "paymentInfos *" PaymentInfo 
Customer "1" *--> "favoriteRestaurants *" Restaurant 
Customer  -->  User 
CustomerOrder "1" *--> "courier 1" Courier 
CustomerOrder "1" *--> "customer 1" Customer 
CustomerOrder "1" *--> "items *" OrderItem 
CustomerOrder "1" *--> "status 1" OrderStatus 
CustomerOrder "1" *--> "restaurant 1" Restaurant 
District "1" *--> "city 1" CityEnum 
District "1" *--> "couriers *" Courier 
DistrictService "1" *--> "addressRepository 1" AddressRepository 
DistrictService "1" *--> "districtRepository 1" DistrictRepository 
DtoAddress "1" *--> "city 1" CityEnum 
DtoCourier  -->  DtoUser 
DtoCourierIU  -->  DtoUserIU 
DtoCourierRequest "1" *--> "requestInfos *" RequestInfo 
DtoCustomer "1" *--> "addresses *" Address 
DtoCustomer "1" *--> "cart 1" Cart 
DtoCustomer  -->  DtoUser 
DtoCustomer "1" *--> "paymentInfos *" PaymentInfo 
DtoCustomer "1" *--> "favoriteRestaurants *" Restaurant 
DtoCustomerIU  -->  DtoUserIU 
DtoDistrict "1" *--> "city 1" CityEnum 
DtoMenuItem "1" *--> "menuItemType 1" MenuItemType 
DtoMenuItemIU "1" *--> "menuItemType 1" MenuItemType 
DtoOrderDetails "1" *--> "customerAddress 1" DtoAddress 
DtoOrderDetails "1" *--> "menuItems *" DtoMenuItem 
DtoOrderStatus "1" *--> "status 1" OrderStatus 
DtoPendingRegister "1" *--> "pendingUsers *" UserInfo 
DtoRestaurant "1" *--> "restaurantCategory 1" RestaurantCategory 
DtoRestaurantIU "1" *--> "restaurantCategory 1" RestaurantCategory 
DtoRestaurantOrders "1" *--> "orderInfoList *" OrderInfo 
DtoRestaurantOwner  -->  DtoUser 
DtoRestaurantOwnerIU  -->  DtoUserIU 
DtoUser "1" *--> "role 1" UserRoles 
DtoUserIU "1" *--> "role 1" UserRoles 
ItemController  ..>  IItemController 
ItemController "1" *--> "itemService 1" IItemService 
UserCartDTO  -->  ItemInfo 
ItemService  ..>  DtoMenuItem : «create»
ItemService  ..>  IItemService 
ItemService  ..>  ItemNotFoundException : «create»
ItemService "1" *--> "itemRepository 1" ItemRepository 
ItemService  ..>  MenuItem : «create»
ItemService "1" *--> "restaurantService 1" RestaurantService 
JwtAuthFilter "1" *--> "jwtService 1" JwtService 
LoginController "1" *--> "loginAuthService 1" LoginService 
LoginService  ..>  InvalidLoginAttemptException : «create»
LoginService "1" *--> "jwtService 1" JwtService 
LoginService  ..>  LoginAuthResponse : «create»
LoginService "1" *--> "userRepository 1" UserRepository 
MenuItem "1" *--> "menuItemType 1" MenuItemType 
MenuItem "1" *--> "restaurant 1" Restaurant 
OrderController "1" *--> "orderService 1" OrderService 
DtoRestaurantOrders  -->  OrderInfo 
OrderInfo "1" *--> "status 1" OrderStatus 
OrderItem "1" *--> "customerOrder 1" CustomerOrder 
OrderItem "1" *--> "menuItem 1" MenuItem 
OrderService "1" *--> "cartService 1" CartService 
OrderService  ..>  CourierIsNotAvailableException : «create»
OrderService  ..>  CourierRequest : «create»
OrderService "1" *--> "courierRequestService 1" CourierRequestService 
OrderService "1" *--> "courierService 1" CourierService 
OrderService  ..>  CustomerOrder : «create»
OrderService "1" *--> "customerOrderRepository 1" CustomerOrderRepository 
OrderService "1" *--> "districtService 1" DistrictService 
OrderService  ..>  DtoAddress : «create»
OrderService  ..>  DtoCourierForOrder : «create»
OrderService  ..>  DtoCourierRequest : «create»
OrderService  ..>  DtoMenuItem : «create»
OrderService  ..>  DtoOrderDetails : «create»
OrderService  ..>  DtoRestaurantOrders : «create»
OrderService "1" *--> "emailService 1" EmailService 
OrderService  ..>  ItemInfo : «create»
OrderService  ..>  ItemNotFoundException : «create»
OrderService "1" *--> "itemService 1" ItemService 
OrderService  ..>  MinOrderPriceNotMeetException : «create»
OrderService  ..>  OrderInfo : «create»
OrderService  ..>  OrderItem : «create»
OrderService "1" *--> "orderItemRepository 1" OrderItemRepository 
OrderService  ..>  OrderNotFoundException : «create»
OrderService  ..>  PaymentInfo : «create»
OrderService "1" *--> "paymentRepository 1" PaymentRepository 
OrderService  ..>  RequestInfo : «create»
OrderService  ..>  RestaurantNotFoundException : «create»
OrderService "1" *--> "restaurantService 1" RestaurantService 
OrderService  ..>  UserCartDTO : «create»
OrderService  ..>  UserNotFoundException : «create»
OrderService "1" *--> "userService 1" UserService 
PaymentController  ..>  IPaymentController 
PaymentController "1" *--> "paymentService 1" IPaymentService 
PaymentInfo "1" *--> "cardType 1" CardType 
PaymentInfo "1" *--> "customer 1" Customer 
PaymentService  ..>  IPaymentService 
PaymentService "1" *--> "paymentRepository 1" PaymentRepository 
RegistrationController "1" *--> "registrationService 1" RegistrationService 
RegistrationService  ..>  Address : «create»
RegistrationService "1" *--> "confirmationTokenService 1" ConfirmationTokenService 
RegistrationService  ..>  Courier : «create»
RegistrationService "1" *--> "courierService 1" CourierService 
RegistrationService  ..>  Customer : «create»
RegistrationService "1" *--> "districtService 1" DistrictService 
RegistrationService "1" *--> "emailService 1" EmailService 
RegistrationService  ..>  Restaurant : «create»
RegistrationService  ..>  RestaurantOwner : «create»
RegistrationService "1" *--> "restaurantOwnerService 1" RestaurantOwnerService 
RegistrationService  ..>  UserAlreadyExistException : «create»
RegistrationService  ..>  UserNotFoundException : «create»
RegistrationService "1" *--> "userService 1" UserService 
RequestInfo "1" *--> "customerAddress 1" DtoAddress 
DtoCourierRequest  -->  RequestInfo 
RequestInfo "1" *--> "menuItems *" DtoMenuItem 
Restaurant "1" *--> "address 1" Address 
Restaurant "1" *--> "orders *" CustomerOrder 
Restaurant "1" *--> "menuItems *" MenuItem 
Restaurant "1" *--> "restaurantCategory 1" RestaurantCategory 
Restaurant "1" *--> "restaurantOwner 1" RestaurantOwner 
RestaurantController  ..>  IRestaurantController 
RestaurantController "1" *--> "restaurantService 1" RestaurantService 
RestaurantOwner "1" *--> "restaurant 1" Restaurant 
RestaurantOwner  -->  User 
RestaurantOwnerFullDto "1" *--> "addressInfo 1" DtoAddress 
RestaurantOwnerFullDto "1" *--> "restaurantInfo 1" DtoRestaurantIU 
RestaurantOwnerFullDto "1" *--> "userInfo 1" RestaurantOwnerRegistrationRequest 
RestaurantOwnerService "1" *--> "restaurantOwnerRepository 1" RestaurantOwnerRepository 
RestaurantRequest "1" *--> "restaurantCategory 1" RestaurantCategory 
RestaurantSearchController "1" *--> "restaurantService 1" RestaurantSearchService 
RestaurantSearchService "1" *--> "restaurantRepository 1" RestaurantRepository 
RestaurantService  ..>  DtoRestaurant : «create»
RestaurantService  ..>  IRestaurantService 
RestaurantService  ..>  Restaurant : «create»
RestaurantService  ..>  RestaurantNotFoundException : «create»
RestaurantService "1" *--> "restaurantRepository 1" RestaurantRepository 
SecurityConfig  ..>  AccessDeniedExceptionHandler : «create»
SecurityConfig  ..>  AuthenticationExceptionHandler : «create»
SecurityConfig  ..>  JwtAuthFilter : «create»
SuspensionService "1" *--> "banRepository 1" BanRepository 
User "1" *--> "role 1" UserRoles 
UserCartDTO "1" *--> "items *" ItemInfo 
UserController  ..>  IUserController 
UserController "1" *--> "userService 1" UserService 
DtoPendingRegister  -->  UserInfo 
UserInfo "1" *--> "role 1" UserRoles 
UserService  ..>  Ban : «create»
UserService "1" *--> "courierRepository 1" CourierRepository 
UserService "1" *--> "customerRepository 1" CustomerRepository 
UserService  ..>  DtoCourier : «create»
UserService  ..>  DtoCustomer : «create»
UserService  ..>  DtoPendingRegister : «create»
UserService  ..>  DtoRestaurantOwner : «create»
UserService  ..>  DtoUser : «create»
UserService  ..>  IUserService 
UserService "1" *--> "restaurantOwnerRepository 1" RestaurantOwnerRepository 
UserService "1" *--> "suspensionService 1" SuspensionService 
UserService  ..>  UserInfo : «create»
UserService  ..>  UserNotFoundException : «create»
UserService "1" *--> "userRepository 1" UserRepository 
