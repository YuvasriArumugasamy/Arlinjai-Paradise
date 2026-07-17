(async () => {
  try {
    const body = {
      roomId: 'deluxe-ac',
      checkIn: '2026-07-20',
      checkOut: '2026-07-21',
      guests: 2,
      name: 'Offline Test',
      phone: '9999999999',
      roomAmount: 2800,
      paymentMethod: 'pay_at_hotel'
    }

    const res = await fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    const text = await res.text()
    console.log('Status:', res.status)
    console.log('Body:', text)
  } catch (err) {
    console.error('Request failed:', err)
  }
})()
