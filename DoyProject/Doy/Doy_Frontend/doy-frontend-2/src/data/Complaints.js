const complaintsMockData = [
    { id: "#001", name: "Sarah K", date: "14/03/25", status: "Open", customer: "Sarah K", restaurant: "Burger House", filedDate: "2025-03-14", type: "Late Delivery", description: "Order arrived very late and cold..." },
    { id: "#002", name: "John D", date: "13/03/25", status: "Resolved", customer: "John D", restaurant: "Pizza Place", filedDate: "2025-03-13", type: "Wrong Item", description: "Received wrong items in the order..." },
    { id: "#003", name: "David G", date: "10/03/25", status: "Open", customer: "David G", restaurant: "Sushi World", filedDate: "2025-03-10", type: "Missing Item", description: "One of the ordered items was missing..." },
    { id: "#004", name: "Albert E", date: "12/03/25", status: "Open", customer: "Albert E", restaurant: "Pizza Place", filedDate: "2025-03-12", type: "Late Delivery", description: "Order arrived 1 hour late..." },
    { id: "#005", name: "Emma T", date: "09/03/25", status: "Resolved", customer: "Emma T", restaurant: "Taco Town", filedDate: "2025-03-09", type: "Rude Staff", description: "The delivery person was rude." },
    { id: "#006", name: "Michael B", date: "08/03/25", status: "Open", customer: "Michael B", restaurant: "Vegan Delight", filedDate: "2025-03-08", type: "Missing Item", description: "Salad was missing from the order." },
    { id: "#007", name: "Sophia P", date: "07/03/25", status: "Resolved", customer: "Sophia P", restaurant: "Burger House", filedDate: "2025-03-07", type: "Wrong Item", description: "Burger had beef instead of veggie patty." },
    { id: "#008", name: "Daniel R", date: "06/03/25", status: "Open", customer: "Daniel R", restaurant: "Sushi World", filedDate: "2025-03-06", type: "Late Delivery", description: "Order arrived 30 minutes late." },
    { id: "#009", name: "Olivia C", date: "05/03/25", status: "Resolved", customer: "Olivia C", restaurant: "Noodle Hub", filedDate: "2025-03-05", type: "Cold Food", description: "Noodles were cold and sticky." },
    { id: "#010", name: "William S", date: "04/03/25", status: "Open", customer: "William S", restaurant: "Pizza Place", filedDate: "2025-03-04", type: "Late Delivery", description: "Food arrived after 90 minutes." },
    { id: "#011", name: "Isabella M", date: "03/03/25", status: "Open", customer: "Isabella M", restaurant: "Taco Town", filedDate: "2025-03-03", type: "Wrong Item", description: "Received chicken tacos instead of veggie." },
    { id: "#012", name: "James L", date: "02/03/25", status: "Resolved", customer: "James L", restaurant: "Burger House", filedDate: "2025-03-02", type: "Late Delivery", description: "Delivery was extremely late." },
    { id: "#013", name: "Mia N", date: "01/03/25", status: "Open", customer: "Mia N", restaurant: "Sushi World", filedDate: "2025-03-01", type: "Rude Staff", description: "Driver spoke harshly on call." },
    { id: "#014", name: "Benjamin Q", date: "28/02/25", status: "Resolved", customer: "Benjamin Q", restaurant: "Noodle Hub", filedDate: "2025-02-28", type: "Wrong Item", description: "Different dish delivered than ordered." },
    { id: "#015", name: "Charlotte U", date: "27/02/25", status: "Open", customer: "Charlotte U", restaurant: "Pizza Place", filedDate: "2025-02-27", type: "Late Delivery", description: "Order delivered cold and late." },
    { id: "#016", name: "Henry F", date: "26/02/25", status: "Open", customer: "Henry F", restaurant: "Burger House", filedDate: "2025-02-26", type: "Missing Item", description: "Missing drinks in the order." },
    { id: "#017", name: "Amelia G", date: "25/02/25", status: "Resolved", customer: "Amelia G", restaurant: "Vegan Delight", filedDate: "2025-02-25", type: "Cold Food", description: "Soup was almost frozen." },
    { id: "#018", name: "Logan W", date: "24/02/25", status: "Open", customer: "Logan W", restaurant: "Sushi World", filedDate: "2025-02-24", type: "Wrong Item", description: "Wrong sushi rolls delivered." },
    { id: "#019", name: "Harper H", date: "23/02/25", status: "Resolved", customer: "Harper H", restaurant: "Noodle Hub", filedDate: "2025-02-23", type: "Rude Staff", description: "Driver yelled during delivery." },
    { id: "#020", name: "Ethan I", date: "22/02/25", status: "Open", customer: "Ethan I", restaurant: "Taco Town", filedDate: "2025-02-22", type: "Missing Item", description: "No extra sauces provided." },
    { id: "#021", name: "Abigail V", date: "21/02/25", status: "Resolved", customer: "Abigail V", restaurant: "Burger House", filedDate: "2025-02-21", type: "Late Delivery", description: "Delivery took too long to arrive." },
    { id: "#022", name: "Matthew B", date: "20/02/25", status: "Open", customer: "Matthew B", restaurant: "Sushi World", filedDate: "2025-02-20", type: "Wrong Item", description: "Mismatched order." },
    { id: "#023", name: "Ella Y", date: "19/02/25", status: "Open", customer: "Ella Y", restaurant: "Pizza Place", filedDate: "2025-02-19", type: "Late Delivery", description: "2 hours late delivery." },
    { id: "#024", name: "Jacob X", date: "18/02/25", status: "Resolved", customer: "Jacob X", restaurant: "Vegan Delight", filedDate: "2025-02-18", type: "Cold Food", description: "Order was completely cold." }
];

export default complaintsMockData;
