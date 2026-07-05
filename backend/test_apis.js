import fs from 'fs';

const BASE_URL = 'http://localhost:5000/api';

const tests = [
  {
    name: 'contact',
    endpoint: '/contact',
    payload: { fullName: "Test User", email: "test@test.com", phone: "123", college: "Test College", department: "CS", message: "Test message" },
    updatePayload: { status: "Reviewed" }
  },
  {
    name: 'events',
    endpoint: '/events',
    payload: { title: "Test Event", description: "Desc", date: "2026-01-01", location: "Test Loc" },
    updatePayload: { title: "Updated Event" }
  },
  {
    name: 'team',
    endpoint: '/team',
    payload: { name: "Test Member", role: "Role", category: "Cat" },
    updatePayload: { role: "Updated Role" }
  },
  {
    name: 'announcements',
    endpoint: '/announcements',
    payload: { title: "Test Ann", content: "Content" },
    updatePayload: { isPublished: false }
  },
  {
    name: 'feedback',
    endpoint: '/feedback',
    payload: { name: "Test", email: "test@test.com", rating: 5, feedback: "Great" },
    updatePayload: null
  },
  {
    name: 'newsletter',
    endpoint: '/newsletter',
    payload: { email: `test_${Date.now()}@test.com` },
    updatePayload: { status: "Unsubscribed" }
  },
  {
    name: 'join',
    endpoint: '/join',
    payload: { name: "Test Join", email: "test@test.com", phone: "123", college: "Col", department: "Dep", year: "1", membershipType: "Student" },
    updatePayload: { status: "Approved" }
  },
  {
    name: 'sponsors',
    endpoint: '/sponsors',
    payload: { name: "Test Sponsor", logo: "logo.png" },
    updatePayload: { tier: "Gold" }
  },
  {
    name: 'gallery',
    endpoint: '/gallery',
    payload: { title: "Test Image", imageUrl: "image.png" },
    updatePayload: { title: "Updated Image" }
  },
  {
    name: 'settings',
    endpoint: '/settings',
    payload: { key: `testKey_${Date.now()}`, value: "Test Value", description: "Test" },
    updatePayload: { value: "Updated Value" },
    idField: 'key'
  }
];

async function runTests() {
  const results = [];
  
  // Dashboard
  console.log("Testing dashboard stats...");
  try {
    const res = await fetch(`${BASE_URL}/dashboard/stats`);
    results.push({ module: 'dashboard', operation: 'GET', status: res.status });
  } catch (e) {
    results.push({ module: 'dashboard', operation: 'GET', status: 'ERROR', error: e.message });
  }

  for (const t of tests) {
    console.log(`Testing ${t.name}...`);
    try {
      // POST
      let res = await fetch(`${BASE_URL}${t.endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(t.payload)
      });
      const postData = await res.json();
      results.push({ module: t.name, operation: 'POST', status: res.status });

      if (res.status === 201) {
        const id = t.idField ? postData[t.idField] : postData._id;

        // GET all
        res = await fetch(`${BASE_URL}${t.endpoint}`);
        results.push({ module: t.name, operation: 'GET ALL', status: res.status });

        // GET by ID
        res = await fetch(`${BASE_URL}${t.endpoint}/${id}`);
        results.push({ module: t.name, operation: 'GET ID', status: res.status });

        // PUT
        if (t.updatePayload) {
          res = await fetch(`${BASE_URL}${t.endpoint}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(t.updatePayload)
          });
          results.push({ module: t.name, operation: 'PUT', status: res.status });
        }

        // DELETE
        res = await fetch(`${BASE_URL}${t.endpoint}/${id}`, {
          method: 'DELETE'
        });
        results.push({ module: t.name, operation: 'DELETE', status: res.status });
      }
    } catch (e) {
      results.push({ module: t.name, operation: 'ALL', status: 'ERROR', error: e.message });
    }
  }

  fs.writeFileSync('test_results.json', JSON.stringify(results, null, 2));
  console.log("Tests completed. See test_results.json");
}

runTests();
