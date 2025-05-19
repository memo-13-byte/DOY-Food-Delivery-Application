```mermaid
sequenceDiagram
    %% ACTORS
    actor Courier
    
    %% FRONTEND
    participant CourierOrdersPage as "courier-orders-page.jsx"
    participant CourierProfilePage as "courier-profile-page.jsx"
    participant AxiosService as "AxiosService"
    participant QueryService as "queryClient Service"
    
    %% BACKEND LAYERS
    participant OrderController as "OrderController.java"
    participant CourierController as "UserController.java"
    participant CourierService as "CourierService.java"
    participant OrderService as "OrderService.java"
    participant CourierRepository as "CourierRepository.java"
    participant OrderRepository as "CustomerOrderRepository.java"
    participant DB as "PostgreSQL<br/>Database"
    
    %% COURIER DASHBOARD AND AVAILABILITY TOGGLE
    Courier->>CourierProfilePage: 1. Login and navigate to Dashboard
    Note over CourierProfilePage: Page: /courier/profile/:id<br/>Components: ActiveToggle, ProfileDetails<br/>State: courierProfile, activeStatus
    
    alt Courier not logged in
        CourierProfilePage->>CourierProfilePage: 2.1. Redirect to /auth
        CourierProfilePage-->>Courier: 2.2. Show login page
    else Courier logged in
        CourierProfilePage->>QueryService: 3.1. useQuery("/api/couriers/{id}")
        QueryService->>AxiosService: 3.2. axios.get("/api/couriers/{id}")
        AxiosService->>CourierController: 3.3. GET /api/couriers/{id}
        Note over CourierController: UserController.getCourierById()
        
        CourierController->>CourierService: 4. getCourierById(courierId)
        Note over CourierService: CourierService.java
        
        CourierService->>CourierRepository: 5. findById(courierId)
        Note over CourierRepository: extends JpaRepository<Courier, Long>
        
        CourierRepository->>DB: 6. SELECT * FROM courier c JOIN user u ON c.user_id = u.id WHERE c.id = ?
        Note over DB: Tables: courier, user, customer_order, delivery
        
        alt Courier not found
            DB-->>CourierRepository: 7.1. Empty result
            CourierRepository-->>CourierService: 7.2. Empty Optional
            CourierService-->>CourierController: 7.3. Throw UserNotFoundException
            CourierController-->>AxiosService: 7.4. 404 Not Found
            AxiosService-->>QueryService: 7.5. Error Response
            QueryService-->>CourierProfilePage: 7.6. Error in query result
            CourierProfilePage-->>Courier: 7.7. Show "User not found" error
        else Access denied (not own profile)
            DB-->>CourierRepository: 8.1. Courier record
            CourierRepository-->>CourierService: 8.2. Courier entity
            CourierService->>CourierService: 8.3. Check if user is accessing own profile
            CourierService-->>CourierController: 8.4. Throw AccessDeniedException
            CourierController-->>AxiosService: 8.5. 403 Forbidden
            AxiosService-->>QueryService: 8.6. Error Response
            QueryService-->>CourierProfilePage: 8.7. Error in query result
            CourierProfilePage-->>Courier: 8.8. Show "Access denied" error
        else Account suspended
            DB-->>CourierRepository: 9.1. Courier record with suspended status
            CourierRepository-->>CourierService: 9.2. Courier entity with suspended status
            CourierService->>CourierService: 9.3. Check account status
            CourierService-->>CourierController: 9.4. Throw ApiError("Account suspended")
            CourierController-->>AxiosService: 9.5. 403 Forbidden
            AxiosService-->>QueryService: 9.6. Error Response
            QueryService-->>CourierProfilePage: 9.7. Error in query result
            CourierProfilePage-->>Courier: 9.8. Show "Account suspended" error message
        else Successful retrieval
            DB-->>CourierRepository: 10.1. Courier record with User data
            CourierRepository-->>CourierService: 10.2. Courier entity
            
            CourierService->>CourierService: 10.3. Map entity to DTO
            CourierService-->>CourierController: 10.4. DtoCourier
            CourierController-->>AxiosService: 10.5. 200 OK with courier profile JSON
            AxiosService-->>QueryService: 10.6. Success Response with data
            QueryService-->>CourierProfilePage: 10.7. Data available in useQuery result
            CourierProfilePage-->>Courier: 10.8. Display dashboard with active toggle
        end
    end
    
    %% TOGGLE ACTIVE STATUS
    Courier->>CourierProfilePage: 11. Toggle "Available for Delivery"
    CourierProfilePage->>QueryService: 12. useMutation for API request
    QueryService->>AxiosService: 13. axios.patch("/api/couriers/{id}/status", { active: newStatus })
    AxiosService->>CourierController: 14. PATCH /api/couriers/{id}/status
    Note over CourierController: UserController.updateCourierStatus()
    
    CourierController->>CourierService: 15. updateCourierStatus(courierId, status)
    
    CourierService->>CourierRepository: 16. findById(courierId)
    CourierRepository->>DB: 17. SELECT * FROM courier WHERE id = ?
    
    alt Courier not found
        DB-->>CourierRepository: 18.1. Empty result
        CourierRepository-->>CourierService: 18.2. Empty Optional
        CourierService-->>CourierController: 18.3. Throw UserNotFoundException
        CourierController-->>AxiosService: 18.4. 404 Not Found
        AxiosService-->>QueryService: 18.5. Error Response
        QueryService-->>CourierProfilePage: 18.6. Error in mutation result
        CourierProfilePage-->>Courier: 18.7. Show "Courier not found" error
    else Access denied (not own profile)
        DB-->>CourierRepository: 19.1. Courier record
        CourierRepository-->>CourierService: 19.2. Courier entity
        CourierService->>CourierService: 19.3. Check if user is accessing own profile
        CourierService-->>CourierController: 19.4. Throw AccessDeniedException
        CourierController-->>AxiosService: 19.5. 403 Forbidden
        AxiosService-->>QueryService: 19.6. Error Response
        QueryService-->>CourierProfilePage: 19.7. Error in mutation result
        CourierProfilePage-->>Courier: 19.8. Show "Access denied" error
    else Account suspended
        DB-->>CourierRepository: 20.1. Courier record with suspended status
        CourierRepository-->>CourierService: 20.2. Courier entity with suspended status
        CourierService->>CourierService: 20.3. Check account status
        CourierService-->>CourierController: 20.4. Throw ApiError("Account suspended")
        CourierController-->>AxiosService: 20.5. 403 Forbidden
        AxiosService-->>QueryService: 20.6. Error Response
        QueryService-->>CourierProfilePage: 20.7. Error in mutation result
        CourierProfilePage-->>Courier: 20.8. Show "Account suspended" message
    else Has active deliveries and trying to go inactive
        DB-->>CourierRepository: 21.1. Courier record
        CourierRepository-->>CourierService: 21.2. Courier entity
        
        CourierService->>OrderRepository: 21.3. existsByCourierIdAndStatusIn(courierId, activeStatuses)
        OrderRepository->>DB: 21.4. SELECT EXISTS(SELECT 1 FROM customer_order WHERE courier_id = ? AND status IN ('OUT_FOR_DELIVERY'))
        DB-->>OrderRepository: 21.5. TRUE
        OrderRepository-->>CourierService: 21.6. true
        
        CourierService-->>CourierController: 21.7. Throw ApiError("Cannot go inactive with active deliveries")
        CourierController-->>AxiosService: 21.8. 400 Bad Request
        AxiosService-->>QueryService: 21.9. Error Response
        QueryService-->>CourierProfilePage: 21.10. Error in mutation result
        CourierProfilePage-->>Courier: 21.11. Show "Cannot go inactive with active deliveries" error
    else Successful status update
        DB-->>CourierRepository: 22.1. Courier record
        CourierRepository-->>CourierService: 22.2. Courier entity
        
        CourierService->>CourierService: 22.3. Update courier active status
        CourierService->>CourierRepository: 22.4. save(courier)
        
        alt Database error during update
            CourierRepository->>DB: 22.5.1. UPDATE courier SET active = ? WHERE id = ?
            DB-->>CourierRepository: 22.5.2. Throw Database Exception
            CourierRepository-->>CourierService: 22.5.3. Propagate Exception
            CourierService-->>CourierController: 22.5.4. Propagate Exception
            CourierController-->>AxiosService: 22.5.5. 500 Internal Server Error
            AxiosService-->>QueryService: 22.5.6. Error Response
            QueryService-->>CourierProfilePage: 22.5.7. Error in mutation result
            CourierProfilePage-->>Courier: 22.5.8. Show "Failed to update status" error
        else Update successful
            CourierRepository->>DB: 22.6.1. UPDATE courier SET active = ? WHERE id = ?
            DB-->>CourierRepository: 22.6.2. Update confirmation
            CourierRepository-->>CourierService: 22.6.3. Updated Courier entity
            
            CourierService->>CourierService: 22.6.4. Map updated entity to DTO
            CourierService-->>CourierController: 22.6.5. DtoCourier
            CourierController-->>AxiosService: 22.6.6. 200 OK with updated courier
            AxiosService-->>QueryService: 22.6.7. Success Response with data
            QueryService-->>CourierProfilePage: 22.6.8. Success in mutation result
            CourierProfilePage-->>Courier: 22.6.9. Display updated active status
        end
    end
    
    %% VIEW AVAILABLE ORDERS
    Courier->>CourierOrdersPage: 23. Navigate to Courier Orders
    Note over CourierOrdersPage: Page: /courier/requests/:id<br/>Components: AvailableOrdersList, ActiveDeliveries<br/>State: availableOrders, activeDeliveries
    
    alt Courier not logged in or inactive
        CourierOrdersPage->>CourierOrdersPage: 24.1. Redirect to /auth or profile
        CourierOrdersPage-->>Courier: 24.2. Show appropriate page
    else Courier logged in and active
        CourierOrdersPage->>QueryService: 25.1. useQuery("/api/couriers/{id}/available-orders")
        QueryService->>AxiosService: 25.2. axios.get("/api/couriers/{id}/available-orders")
        AxiosService->>OrderController: 25.3. GET /api/couriers/{id}/available-orders
        Note over OrderController: OrderController.getAvailableOrdersForCourier()
        
        OrderController->>OrderService: 26. getAvailableOrdersForCourier(courierId)
        
        %% GET COURIER INFORMATION FIRST
        OrderService->>CourierService: 27. getCourierById(courierId)
        CourierService->>CourierRepository: 28. findById(courierId)
        CourierRepository->>DB: 29. SELECT * FROM courier WHERE id = ?
        
        alt Courier not found
            DB-->>CourierRepository: 30.1. Empty result
            CourierRepository-->>CourierService: 30.2. Empty Optional
            CourierService-->>OrderService: 30.3. Throw UserNotFoundException
            OrderService-->>OrderController: 30.4. Propagate Exception
            OrderController-->>AxiosService: 30.5. 404 Not Found
            AxiosService-->>QueryService: 30.6. Error Response
            QueryService-->>CourierOrdersPage: 30.7. Error in query result
            CourierOrdersPage-->>Courier: 30.8. Show "User not found" error
        else Courier not active
            DB-->>CourierRepository: 31.1. Courier record with active=false
            CourierRepository-->>CourierService: 31.2. Courier entity with active=false
            CourierService-->>OrderService: 31.3. Courier entity
            OrderService->>OrderService: 31.4. Check if courier is active
            OrderService-->>OrderController: 31.5. Throw CourierIsNotAvailableException
            OrderController-->>AxiosService: 31.6. 400 Bad Request
            AxiosService-->>QueryService: 31.7. Error Response
            QueryService-->>CourierOrdersPage: 31.8. Error in query result
            CourierOrdersPage-->>Courier: 31.9. Show "You must be active to view orders" message
        else Courier active
            DB-->>CourierRepository: 32.1. Courier record with active=true
            CourierRepository-->>CourierService: 32.2. Courier entity with active=true
            CourierService-->>OrderService: 32.3. Courier entity
            
            %% FIND ORDERS READY FOR PICKUP IN COURIER'S DISTRICT
            OrderService->>OrderRepository: 33.1. findByStatusAndCourierIsNullAndRestaurantAddressDistrictId()
            OrderRepository->>DB: 33.2. SELECT co.* FROM customer_order co JOIN restaurant r ON co.restaurant_id = r.id JOIN address a ON r.address_id = a.id WHERE co.status = 'READY_FOR_PICKUP' AND co.courier_id IS NULL AND a.district_id = ? ORDER BY co.created_at ASC
            
            alt Database error
                DB-->>OrderRepository: 34.1. Throw Database Exception
                OrderRepository-->>OrderService: 34.2. Propagate Exception
                OrderService-->>OrderController: 34.3. Propagate Exception
                OrderController-->>AxiosService: 34.4. 500 Internal Server Error
                AxiosService-->>QueryService: 34.5. Error Response
                QueryService-->>CourierOrdersPage: 34.6. Error in query result
                CourierOrdersPage-->>Courier: 34.7. Show "Failed to load available orders" error
            else No available orders
                DB-->>OrderRepository: 35.1. Empty result set
                OrderRepository-->>OrderService: 35.2. Empty list
                OrderService->>OrderService: 35.3. Map to empty DTO list
                OrderService-->>OrderController: 35.4. Empty List<DtoOrderDetails>
                OrderController-->>AxiosService: 35.5. 200 OK with empty array
                AxiosService-->>QueryService: 35.6. Success Response with empty array
                QueryService-->>CourierOrdersPage: 35.7. Empty data array
                CourierOrdersPage-->>Courier: 35.8. Display "No available orders in your area" message
            else Available orders found
                DB-->>OrderRepository: 36.1. Order records
                OrderRepository-->>OrderService: 36.2. List<CustomerOrder> entities
                
                OrderService->>OrderService: 36.3. Map entities to DTOs with restaurant and delivery info
                OrderService-->>OrderController: 36.4. List<DtoOrderDetails>
                OrderController-->>AxiosService: 36.5. 200 OK with available orders JSON
                AxiosService-->>QueryService: 36.6. Success Response with data
                QueryService-->>CourierOrdersPage: 36.7. Data available in useQuery result
                CourierOrdersPage-->>Courier: 36.8. Display available orders for pickup
            end
            
            %% VIEW ACTIVE DELIVERIES
            CourierOrdersPage->>QueryService: 37.1. useQuery("/api/couriers/{id}/active-deliveries")
            QueryService->>AxiosService: 37.2. axios.get("/api/couriers/{id}/active-deliveries")
            AxiosService->>OrderController: 37.3. GET /api/couriers/{id}/active-deliveries
            Note over OrderController: OrderController.getActiveCourierDeliveries()
            
            OrderController->>OrderService: 38. getActiveCourierDeliveries(courierId)
            
            OrderService->>OrderRepository: 39. findByCourierIdAndStatusIn()
            OrderRepository->>DB: 40. SELECT * FROM customer_order WHERE courier_id = ? AND status IN ('OUT_FOR_DELIVERY', 'READY_FOR_PICKUP') ORDER BY created_at ASC
            
            alt No active deliveries
                DB-->>OrderRepository: 41.1. Empty result set
                OrderRepository-->>OrderService: 41.2. Empty list
                OrderService->>OrderService: 41.3. Map to empty DTO list
                OrderService-->>OrderController: 41.4. Empty List<DtoOrderDetails>
                OrderController-->>AxiosService: 41.5. 200 OK with empty array
                AxiosService-->>QueryService: 41.6. Success Response with empty array
                QueryService-->>CourierOrdersPage: 41.7. Empty data array
                CourierOrdersPage-->>Courier: 41.8. Display "No active deliveries" message
            else Active deliveries found
                DB-->>OrderRepository: 42.1. Order records
                OrderRepository-->>OrderService: 42.2. List<CustomerOrder> entities
                
                OrderService->>OrderService: 42.3. Map entities to DTOs
                OrderService-->>OrderController: 42.4. List<DtoOrderDetails>
                OrderController-->>AxiosService: 42.5. 200 OK with active deliveries JSON
                AxiosService-->>QueryService: 42.6. Success Response with data
                QueryService-->>CourierOrdersPage: 42.7. Data available in useQuery result
                CourierOrdersPage-->>Courier: 42.8. Display active deliveries
            end
        end
    end
    
    %% ACCEPT ORDER FOR DELIVERY
    Courier->>CourierOrdersPage: 43. Select order and click "Accept Delivery"
    CourierOrdersPage->>QueryService: 44. useMutation for API request
    QueryService->>AxiosService: 45. axios.post("/api/orders/{id}/accept-delivery", { courierId: courierId })
    AxiosService->>OrderController: 46. POST /api/orders/{id}/accept-delivery
    Note over OrderController: OrderController.acceptOrderDelivery()
    
    OrderController->>OrderService: 47. acceptOrderDelivery(orderId, courierId)
    
    %% VERIFY COURIER STATUS
    OrderService->>CourierService: 48. getCourierById(courierId)
    CourierService->>CourierRepository: 49. findById(courierId)
    CourierRepository->>DB: 50. SELECT * FROM courier WHERE id = ?
    
    alt Courier not found
        DB-->>CourierRepository: 51.1. Empty result
        CourierRepository-->>CourierService: 51.2. Empty Optional
        CourierService-->>OrderService: 51.3. Throw UserNotFoundException
        OrderService-->>OrderController: 51.4. Propagate Exception
        OrderController-->>AxiosService: 51.5. 404 Not Found
        AxiosService-->>QueryService: 51.6. Error Response
        QueryService-->>CourierOrdersPage: 51.7. Error in mutation result
        CourierOrdersPage-->>Courier: 51.8. Show "User not found" error
    else Courier not active
        DB-->>CourierRepository: 52.1. Courier record with active=false
        CourierRepository-->>CourierService: 52.2. Courier entity with active=false
        CourierService-->>OrderService: 52.3. Courier entity
        OrderService->>OrderService: 52.4. Check if courier is active
        OrderService-->>OrderController: 52.5. Throw CourierIsNotAvailableException
        OrderController-->>AxiosService: 52.6. 400 Bad Request
        AxiosService-->>QueryService: 52.7. Error Response
        QueryService-->>CourierOrdersPage: 52.8. Error in mutation result
        CourierOrdersPage-->>Courier: 52.9. Show "You must be active to accept deliveries" error
    else Too many active deliveries
        DB-->>CourierRepository: 53.1. Courier record with active=true
        CourierRepository-->>CourierService: 53.2. Courier entity with active=true
        CourierService-->>OrderService: 53.3. Courier entity
        
        OrderService->>OrderRepository: 53.4. countByCourierIdAndStatusIn(courierId, activeStatuses)
        OrderRepository->>DB: 53.5. SELECT COUNT(*) FROM customer_order WHERE courier_id = ? AND status IN ('OUT_FOR_DELIVERY')
        DB-->>OrderRepository: 53.6. Count > limit
        OrderRepository-->>OrderService: 53.7. Count > limit
        
        OrderService-->>OrderController: 53.8. Throw ApiError("Too many active deliveries")
        OrderController-->>AxiosService: 53.9. 400 Bad Request
        AxiosService-->>QueryService: 53.10. Error Response
        QueryService-->>CourierOrdersPage: 53.11. Error in mutation result
        CourierOrdersPage-->>Courier: 53.12. Show "You have too many active deliveries" error
    else Courier available
        DB-->>CourierRepository: 54.1. Courier record with active=true
        CourierRepository-->>CourierService: 54.2. Courier entity with active=true
        CourierService-->>OrderService: 54.3. Courier entity
        
        %% FIND EXISTING ORDER
        OrderService->>OrderRepository: 55.1. findById(orderId)
        OrderRepository->>DB: 55.2. SELECT * FROM customer_order WHERE id = ?
        
        alt Order not found
            DB-->>OrderRepository: 56.1. Empty result
            OrderRepository-->>OrderService: 56.2. Empty Optional
            OrderService-->>OrderController: 56.3. Throw OrderNotFoundException
            OrderController-->>AxiosService: 56.4. 404 Not Found
            AxiosService-->>QueryService: 56.5. Error Response
            QueryService-->>CourierOrdersPage: 56.6. Error in mutation result
            CourierOrdersPage-->>Courier: 56.7. Show "Order not found" error
        else Order already has courier or status not READY_FOR_PICKUP
            DB-->>OrderRepository: 57.1. OrderRecord with courier_id not null or status != READY_FOR_PICKUP
            OrderRepository-->>OrderService: 57.2. CustomerOrder entity
            OrderService->>OrderService: 57.3. Check order status and courier assignment
            OrderService-->>OrderController: 57.4. Throw ApiError("Order is no longer available")
            OrderController-->>AxiosService: 57.5. 400 Bad Request
            AxiosService-->>QueryService: 57.6. Error Response
            QueryService-->>CourierOrdersPage: 57.7. Error in mutation result
            CourierOrdersPage-->>Courier: 57.8. Show "Order is no longer available" error
        else Order district doesn't match courier district
            DB-->>OrderRepository: 58.1. OrderRecord
            OrderRepository-->>OrderService: 58.2. CustomerOrder entity
            OrderService->>OrderService: 58.3. Check if order restaurant district matches courier district
            OrderService-->>OrderController: 58.4. Throw ApiError("Order is outside your delivery area")
            OrderController-->>AxiosService: 58.5. 400 Bad Request
            AxiosService-->>QueryService: 58.6. Error Response
            QueryService-->>CourierOrdersPage: 58.7. Error in mutation result
            CourierOrdersPage-->>Courier: 58.8. Show "Order is outside your delivery area" error
        else Successful order acceptance
            DB-->>OrderRepository: 59.1. OrderRecord eligible for acceptance
            OrderRepository-->>OrderService: 59.2. CustomerOrder entity
            
            %% TRANSACTION START - ENSURE ATOMICITY
            OrderService->>OrderService: 59.3. Begin transaction
            
            %% ASSIGN COURIER TO ORDER
            OrderService->>OrderService: 59.4. Update order with courier and change status to OUT_FOR_DELIVERY
            OrderService->>OrderRepository: 59.5. save(order)
            
            alt Database error during save
                OrderRepository->>DB: 59.6.1. UPDATE customer_order SET courier_id = ?, status = 'OUT_FOR_DELIVERY', updated_at = ? WHERE id = ?
                DB-->>OrderRepository: 59.6.2. Throw Database Exception
                OrderRepository-->>OrderService: 59.6.3. Propagate Exception
                OrderService->>OrderService: 59.6.4. Rollback transaction
                OrderService-->>OrderController: 59.6.5. Propagate Exception
                OrderController-->>AxiosService: 59.6.6. 500 Internal Server Error
                AxiosService-->>QueryService: 59.6.7. Error Response
                QueryService-->>CourierOrdersPage: 59.6.8. Error in mutation result
                CourierOrdersPage-->>Courier: 59.6.9. Show "Failed to accept delivery" error
            else Save successful
                OrderRepository->>DB: 59.7.1. UPDATE customer_order SET courier_id = ?, status = 'OUT_FOR_DELIVERY', updated_at = ? WHERE id = ?
                DB-->>OrderRepository: 59.7.2. Update confirmation
                OrderRepository-->>OrderService: 59.7.3. Updated CustomerOrder entity
                
                %% CREATE DELIVERY RECORD
                OrderService->>DeliveryRepository: 59.7.4. save(new Delivery(...))
                DeliveryRepository->>DB: 59.7.5. INSERT INTO delivery VALUES (...)
                
                alt Database error during delivery creation
                    DB-->>DeliveryRepository: 59.7.6.1. Throw Database Exception
                    DeliveryRepository-->>OrderService: 59.7.6.2. Propagate Exception
                    OrderService->>OrderService: 59.7.6.3. Rollback transaction
                    OrderService-->>OrderController: 59.7.6.4. Propagate Exception
                    OrderController-->>AxiosService: 59.7.6.5. 500 Internal Server Error
                    AxiosService-->>QueryService: 59.7.6.6. Error Response
                    QueryService-->>CourierOrdersPage: 59.7.6.7. Error in mutation result
                    CourierOrdersPage-->>Courier: 59.7.6.8. Show "Failed to accept delivery" error
                else Delivery creation successful
                    DB-->>DeliveryRepository: 59.7.7.1. New delivery record
                    DeliveryRepository-->>OrderService: 59.7.7.2. Delivery entity
                    
                    OrderService->>OrderService: 59.7.7.3. Commit transaction
                    
                    %% NOTIFY CUSTOMER OF COURIER ASSIGNMENT
                    OrderService->>EmailService: 59.7.7.4. sendCourierAssignedEmail(order, courier)
                    
                    OrderService->>OrderService: 59.7.7.5. Map entities to DTO
                    OrderService-->>OrderController: 59.7.7.6. DtoOrderDetails
                    OrderController-->>AxiosService: 59.7.7.7. 200 OK with delivery details
                    AxiosService-->>QueryService: 59.7.7.8. Success Response with data
                    QueryService-->>CourierOrdersPage: 59.7.7.9. Success in mutation result
                    
                    %% REFRESH BOTH AVAILABLE AND ACTIVE ORDERS
                    CourierOrdersPage->>QueryService: 59.7.7.10. Invalidate and refetch queries
                    CourierOrdersPage-->>Courier: 59.7.7.11. Show "Delivery accepted" confirmation and update view
                end
            end
        end
    end
    
    %% MARK ORDER AS DELIVERED
    Courier->>CourierOrdersPage: 60. Click "Mark as Delivered" for active delivery
    CourierOrdersPage-->>Courier: 61. Show confirmation dialog
    Courier->>CourierOrdersPage: 62. Confirm delivery
    
    CourierOrdersPage->>QueryService: 63. useMutation for API request
    QueryService->>AxiosService: 64. axios.patch("/api/orders/{id}/deliver", { courierId: courierId })
    AxiosService->>OrderController: 65. PATCH /api/orders/{id}/deliver
    Note over OrderController: OrderController.markOrderDelivered()
    
    OrderController->>OrderService: 66. markOrderDelivered(orderId, courierId)
    
    %% FIND EXISTING ORDER
    OrderService->>OrderRepository: 67. findById(orderId)
    OrderRepository->>DB: 68. SELECT * FROM customer_order WHERE id = ?
    
    alt Order not found
        DB-->>OrderRepository: 69.1. Empty result
        OrderRepository-->>OrderService: 69.2. Empty Optional
        OrderService-->>OrderController: 69.3. Throw OrderNotFoundException
        OrderController-->>AxiosService: 69.4. 404 Not Found
        AxiosService-->>QueryService: 69.5. Error Response
        QueryService-->>CourierOrdersPage: 69.6. Error in mutation result
        CourierOrdersPage-->>Courier: 69.7. Show "Order not found" error
    else Order not assigned to this courier
        DB-->>OrderRepository: 70.1. CustomerOrder record with different courier_id
        OrderRepository-->>OrderService: 70.2. CustomerOrder entity
        OrderService->>OrderService: 70.3. Check if order is assigned to courier
        OrderService-->>OrderController: 70.4. Throw AccessDeniedException
        OrderController-->>AxiosService: 70.5. 403 Forbidden
        AxiosService-->>QueryService: 70.6. Error Response
        QueryService-->>CourierOrdersPage: 70.7. Error in mutation result
        CourierOrdersPage-->>Courier: 70.8. Show "Access denied" error
    else Order not in OUT_FOR_DELIVERY status
        DB-->>OrderRepository: 71.1. CustomerOrder record with wrong status
        OrderRepository-->>OrderService: 71.2. CustomerOrder entity
        OrderService->>OrderService: 71.3. Check order status
        OrderService-->>OrderController: 71.4. Throw ApiError("Order is not ready for delivery completion")
        OrderController-->>AxiosService: 71.5. 400 Bad Request
        AxiosService-->>QueryService: 71.6. Error Response
        QueryService-->>CourierOrdersPage: 71.7. Error in mutation result
        CourierOrdersPage-->>Courier: 71.8. Show "Order is not ready for delivery completion" error
    else Successful delivery completion
        DB-->>OrderRepository: 72.1. CustomerOrder record
        OrderRepository-->>OrderService: 72.2. CustomerOrder entity
        
        %% UPDATE ORDER STATUS
        OrderService->>OrderService: 72.3. Set order status to DELIVERED
        OrderService->>OrderRepository: 72.4. save(order)
        
        alt Database error during update
            OrderRepository->>DB: 72.5.1. UPDATE customer_order SET status = 'DELIVERED', updated_at = ? WHERE id = ?
            DB-->>OrderRepository: 72.5.2. Throw Database Exception
            OrderRepository-->>OrderService: 72.5.3. Propagate Exception
            OrderService-->>OrderController: 72.5.4. Propagate Exception
            OrderController-->>AxiosService: 72.5.5. 500 Internal Server Error
            AxiosService-->>QueryService: 72.5.6. Error Response
            QueryService-->>CourierOrdersPage: 72.5.7. Error in mutation result
            CourierOrdersPage-->>Courier: 72.5.8. Show "Failed to complete delivery" error
        else Update successful
            OrderRepository->>DB: 72.6.1. UPDATE customer_order SET status = 'DELIVERED', updated_at = ? WHERE id = ?
            DB-->>OrderRepository: 72.6.2. Update confirmation
            OrderRepository-->>OrderService: 72.6.3. Updated CustomerOrder entity
            
            %% UPDATE DELIVERY RECORD
            OrderService->>DeliveryRepository: 72.6.4. findByOrderId(orderId)
            DeliveryRepository->>DB: 72.6.5. SELECT * FROM delivery WHERE order_id = ?
            DB-->>DeliveryRepository: 72.6.6. Delivery record
            DeliveryRepository-->>OrderService: 72.6.7. Delivery entity
            
            OrderService->>DeliveryRepository: 72.6.8. updateDeliveredAt(deliveryId)
            DeliveryRepository->>DB: 72.6.9. UPDATE delivery SET delivered_at = ?, updated_at = ? WHERE id = ?
            DB-->>DeliveryRepository: 72.6.10. Update confirmation
            
            %% NOTIFY CUSTOMER OF DELIVERY
            OrderService->>EmailService: 72.6.11. sendOrderDeliveredEmail(order)
            
            OrderService->>OrderService: 72.6.12. Map updated entity to DTO
            OrderService-->>OrderController: 72.6.13. DtoOrderDetails
            OrderController-->>AxiosService: 72.6.14. 200 OK with updated order
            AxiosService-->>QueryService: 72.6.15. Success Response with data
            QueryService-->>CourierOrdersPage: 72.6.16. Success in mutation result
            
            %% REFRESH ACTIVE ORDERS
            CourierOrdersPage->>QueryService: 72.6.17. Invalidate and refetch active deliveries
            CourierOrdersPage-->>Courier: 72.6.18. Show "Delivery completed" confirmation and update view
        end
    end
```