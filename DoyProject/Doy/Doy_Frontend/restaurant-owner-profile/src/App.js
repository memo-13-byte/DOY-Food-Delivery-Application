import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RestaurantOverview from "./pages/RestaurantOverview";
import EditOwnerProfile from "./pages/EditOwnerProfile";
import OrderTracking from "./pages/OrderTracking";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<RestaurantOverview />} />
          <Route path="/edit-profile" element={<EditOwnerProfile />} />
          <Route path="/orders" element={<OrderTracking />} />
        </Routes>
      </Router>
  );
}

export default App;
