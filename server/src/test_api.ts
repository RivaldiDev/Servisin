import app from './index';
import http from 'http';

async function runTests() {
  console.log('🧪 Starting FixGarasi End-to-End API Integration Tests...\n');

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address() as any;
  const baseUrl = `http://localhost:${address.port}/api`;

  let authToken = '';
  let testVehicleId = '';
  let testLogId = '';
  let testReminderId = '';

  const assert = (condition: boolean, testName: string) => {
    if (!condition) {
      console.error(`❌ FAILED: ${testName}`);
      throw new Error(`Assertion failed for: ${testName}`);
    } else {
      console.log(`✅ PASSED: ${testName}`);
    }
  };

  try {
    // 1. Health Check
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthData = (await healthRes.json()) as any;
    assert(healthRes.status === 200 && healthData.status === 'online', '1. GET /health');

    // 2. Auth: Register Fresh Test User
    const testEmail = `tester_${Date.now()}@fixgarasi.id`;
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Test Automation User',
        email: testEmail,
        password: 'password123',
        phoneNumber: '081299998888',
      }),
    });
    const regData = (await regRes.json()) as any;
    assert(regRes.status === 201 && regData.success && !!regData.data.token, '2. POST /auth/register');
    authToken = regData.data.token;

    // 3. Auth: Get Current User Profile
    const meRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const meData = (await meRes.json()) as any;
    assert(meRes.status === 200 && meData.data.email === testEmail, '3. GET /auth/me');

    // 4. Auth: Toggle Tier to PRO
    const tierRes = await fetch(`${baseUrl}/auth/toggle-tier`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tier: 'PRO' }),
    });
    const tierData = (await tierRes.json()) as any;
    assert(tierRes.status === 200 && tierData.data.tier === 'PRO', '4. POST /auth/toggle-tier');

    // 5. Vehicles: Create New Test Vehicle
    const createVehRes = await fetch(`${baseUrl}/vehicles`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'CAR',
        brand: 'Toyota',
        model: 'Innova Zenix Q Hybrid',
        licensePlate: 'B 9999 TST',
        year: 2024,
        currentOdometer: 5000,
        notes: 'Test Vehicle',
      }),
    });
    const createVehData = await createVehRes.json() as any;
    assert(createVehRes.status === 201 && createVehData.success, '5. POST /vehicles');
    testVehicleId = createVehData.data.id;

    // 6. Vehicles: Update Odometer
    const odoRes = await fetch(`${baseUrl}/vehicles/${testVehicleId}/odometer`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ odometer: 6200 }),
    });
    const odoData = (await odoRes.json()) as any;
    assert(
      odoRes.status === 200 &&
        (odoData.data?.vehicle?.currentOdometer === 6200 || odoData.data?.currentOdometer === 6200),
      '6. PATCH /vehicles/:id/odometer'
    );

    // 7. Service Logs: Create Log
    const createLogRes = await fetch(`${baseUrl}/service-logs`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vehicleId: testVehicleId,
        serviceDate: new Date().toISOString(),
        odometer: 6200,
        workshopName: 'Auto2000 Tebet',
        workshopAddress: 'Jakarta Selatan',
        notes: 'Ganti oli pertama 5.000 KM',
        items: [
          { category: 'ENGINE_OIL', description: 'Oli TMO 0W-20 (4L)', cost: 450000 },
          { category: 'AIR_FILTER', description: 'Filter Oli', cost: 50000 },
        ],
      }),
    });
    const createLogData = await createLogRes.json() as any;
    assert(createLogRes.status === 201 && createLogData.success, '7. POST /service-logs');
    testLogId = createLogData.data.id;

    // 8. Service Logs: Get Service Log by ID
    const getLogRes = await fetch(`${baseUrl}/service-logs/${testLogId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const getLogData = await getLogRes.json() as any;
    assert(getLogRes.status === 200 && getLogData.data.items.length === 2, '8. GET /service-logs/:id');

    // 9. Service Logs: Update Service Log
    const updateLogRes = await fetch(`${baseUrl}/service-logs/${testLogId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        workshopName: 'Auto2000 Tebet Resmi',
        notes: 'Ganti oli pertama 5.000 KM (Update)',
        items: [
          { category: 'ENGINE_OIL', description: 'Oli TMO 0W-20 (4L)', cost: 480000 },
        ],
      }),
    });
    const updateLogData = await updateLogRes.json() as any;
    assert(updateLogRes.status === 200 && updateLogData.data.totalCost === 480000, '9. PUT /service-logs/:id');

    // 10. Reminders: Create Reminder
    const createRemRes = await fetch(`${baseUrl}/reminders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vehicleId: testVehicleId,
        title: 'Ganti Oli 10.000 KM',
        category: 'ENGINE_OIL',
        intervalKm: 5000,
        intervalMonths: 6,
        lastServiceOdometer: 6200,
      }),
    });
    const createRemData = await createRemRes.json() as any;
    assert(createRemRes.status === 201 && createRemData.success, '10. POST /reminders');
    testReminderId = createRemData.data.id;

    // 11. Reminders: Update Reminder
    const updateRemRes = await fetch(`${baseUrl}/reminders/${testReminderId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Ganti Oli 10.000 KM (TMO Gold)',
        intervalKm: 6000,
      }),
    });
    const updateRemData = await updateRemRes.json() as any;
    assert(updateRemRes.status === 200 && updateRemData.data.intervalKm === 6000, '11. PUT /reminders/:id');

    // 12. Reminders: Complete Reminder Cycle
    const compRemRes = await fetch(`${baseUrl}/reminders/${testReminderId}/complete`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const compRemData = await compRemRes.json() as any;
    assert(compRemRes.status === 200 && compRemData.success, '12. POST /reminders/:id/complete');

    // 13. Analytics: Get Analytics Summary
    const analyticsRes = await fetch(`${baseUrl}/analytics/summary`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const analyticsData = await analyticsRes.json() as any;
    assert(
      analyticsRes.status === 200 &&
        analyticsData.success &&
        Number.isFinite(analyticsData.data.summary.totalSpent) &&
        Array.isArray(analyticsData.data.monthlyBreakdown),
      '13. GET /analytics/summary'
    );

    // 14. Midtrans: Create Snap Token
    const snapRes = await fetch(`${baseUrl}/payments/create-snap-token`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ planType: 'YEARLY' }),
    });
    const snapData = await snapRes.json() as any;
    assert(snapRes.status === 201 && snapData.success && !!snapData.data.snapToken, '14. POST /payments/create-snap-token');
    const paymentOrderId = snapData.data.orderId;

    // 15. Midtrans: Handle Webhook Notification (Settlement)
    const webhookRes = await fetch(`${baseUrl}/payments/notification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_id: paymentOrderId,
        status_code: '200',
        gross_amount: '149000',
        transaction_status: 'settlement',
        payment_type: 'qris',
      }),
    });
    const webhookData = await webhookRes.json() as any;
    assert(webhookRes.status === 200 && webhookData.success, '15. POST /payments/notification (Webhook)');

    // 16. Midtrans: Get Payment History
    const historyRes = await fetch(`${baseUrl}/payments/history`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const historyData = await historyRes.json() as any;
    assert(historyRes.status === 200 && historyData.success && historyData.data.length > 0, '16. GET /payments/history');

    // 17. Clean up test records
    await fetch(`${baseUrl}/service-logs/${testLogId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    await fetch(`${baseUrl}/reminders/${testReminderId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    await fetch(`${baseUrl}/vehicles/${testVehicleId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log('✅ Cleaned up test records.');

    console.log('\n🎉 ALL 16 END-TO-END INTEGRATION TESTS PASSED PERFECTLY!\n');
  } catch (error: any) {
    console.error('\n❌ Test run failed:', error);
    process.exit(1);
  } finally {
    server.close();
    process.exit(0);
  }
}

runTests();