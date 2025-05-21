import { Button } from "../components/Button";

export function OrderDetailModal({ orderDetails, onClose, isLoading, error, darkMode }) {
    if (!orderDetails && !isLoading && !error) return null;

    const contentBgColor = darkMode ? '#333' : '#fff';
    const textColor = darkMode ? '#eee' : '#333';
    const borderColor = darkMode ? '#555' : '#ddd';

    // Function to safely format the address
    const formatAddress = (address) => {
        if (!address) return 'N/A';
        return [
            address.street,
            address.buildingNumber,
            address.apartmentNumber ? `Daire ${address.apartmentNumber}` : null,
            address.avenue,
            address.neighborhood,
            address.district,
            address.city
        ].filter(part => part !== null && part !== undefined && part !== '').join(', ');
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem',
        }}>
            <div style={{
                backgroundColor: contentBgColor, color: textColor, padding: '2rem',
                borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                maxWidth: '600px', width: '90%', maxHeight: '90vh',
                display: 'flex', flexDirection: 'column',
                position: 'relative',
            }}>
                {/* Close Button ('X') */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '10px', right: '15px', background: 'none',
                        border: 'none', fontSize: '1.8rem', cursor: 'pointer',
                        color: darkMode ? '#aaa' : '#888', lineHeight: '1', flexShrink: 0
                    }}
                    aria-label="Close modal"
                >
                    &times;
                </button>

                {/* Modal Title */}
                <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', borderBottom: `1px solid ${borderColor}`, paddingBottom: '0.5rem', flexShrink: 0 }}>
                    Sipariş Detayları (ID: {orderDetails?.orderId || '...'})
                </h3>

                {/* Scrollable Content Area */}
                <div style={{ flexGrow: 1, overflowY: 'auto', paddingRight: '10px', marginRight: '-10px' }}>
                    {/* Loading/Error States */}
                    {isLoading && <p style={{ textAlign: 'center' }}>Detaylar yükleniyor...</p>}
                    {error && <p style={{ textAlign: 'center', color: 'red' }}>Hata: {error}</p>}

                    {/* Order Details Content */}
                    {orderDetails && !isLoading && !error && (
                        <div>
                            {/* Customer Info */}
                            <div style={{ marginBottom: '1.5rem', borderBottom: `1px solid ${borderColor}`, paddingBottom: '1rem' }}>
                                <h4 style={{ marginBottom: '0.75rem', color: darkMode ? '#bbb' : '#555' }}>Müşteri Bilgileri</h4>
                                <p><strong>İsim:</strong> {orderDetails.customerName || 'N/A'}</p>
                                <p><strong>Telefon:</strong> {orderDetails.customerPhone || 'N/A'}</p>
                                <p><strong>Email:</strong> {orderDetails.customerEmail || 'N/A'}</p>
                                <p><strong>Adres:</strong> {formatAddress(orderDetails.customerAddress)}</p>
                                <p><strong>Not:</strong> {orderDetails.note || 'Yok'}</p>
                            </div>
                            {/* Restaurant Info */}
                            <div style={{ marginBottom: '1.5rem', borderBottom: `1px solid ${borderColor}`, paddingBottom: '1rem' }}>
                                <h4 style={{marginBottom: '0.75rem', color: darkMode ? '#bbb' : '#555' }}>Restoran</h4>
                                <p><strong>Adı:</strong> {orderDetails.restaurantName || 'N/A'}</p>
                            </div>
                            {/* Menu Items */}
                            <div>
                                <h4 style={{ marginBottom: '0.75rem', color: darkMode ? '#bbb' : '#555' }}>Sipariş İçeriği</h4>
                                {orderDetails.menuItems && orderDetails.menuItems.length > 0 ? (
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        {orderDetails.menuItems.map(item => (
                                            <li key={item.id} style={{
                                                border: `1px solid ${borderColor}`, borderRadius: '8px',
                                                padding: '0.75rem', marginBottom: '0.75rem',
                                                backgroundColor: darkMode ? '#444' : '#f9f9f9'
                                            }}>
                                                <div style={{ fontWeight: 'bold' }}>{item.name} ({item.menuItemType})</div>
                                                <div style={{ fontSize: '0.9em', color: darkMode ? '#ccc' : '#666', margin: '0.25rem 0' }}>{item.description}</div>
                                                <div style={{ fontWeight: 'bold', textAlign: 'right' }}>{item.price?.toFixed(2)} TL</div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : ( <p>Siparişte ürün bulunmamaktadır.</p> )}
                            </div>
                        </div>
                    )}
                </div> {/* End Scrollable Area */}

                {/* Close Button (Bottom) */}
                <Button onClick={onClose} style={{ marginTop: '1.5rem', display: 'block', marginLeft: 'auto', marginRight: 'auto', flexShrink: 0 }}>
                    Kapat
                </Button>
            </div>
        </div>
    );
}