const fs = require('fs');

function patchFile(filepath) {
    let content;
    try {
        content = fs.readFileSync(filepath, 'utf8');
    } catch (e) {
        return;
    }

    // 1. Add state variables for students
    content = content.replace(
        "const [studentSociety, setStudentSociety] = useState('IEEE KEC SB');",
        "const [studentSociety, setStudentSociety] = useState('IEEE KEC SB');\n  const [studentEmail, setStudentEmail] = useState('');\n  const [studentPhone, setStudentPhone] = useState('');\n  const [studentLinkedin, setStudentLinkedin] = useState('');"
    );

    // 2. Add to openAddModal
    content = content.replace(
        "setStudentSociety('IEEE KEC SB');\r\n      setStudentImage('');",
        "setStudentSociety('IEEE KEC SB');\r\n      setStudentImage('');\r\n      setStudentEmail('');\r\n      setStudentPhone('');\r\n      setStudentLinkedin('');"
    );
    content = content.replace(
        "setStudentSociety('IEEE KEC SB');\n      setStudentImage('');",
        "setStudentSociety('IEEE KEC SB');\n      setStudentImage('');\n      setStudentEmail('');\n      setStudentPhone('');\n      setStudentLinkedin('');"
    );

    // 3. Add to startInlineEditStudent
    content = content.replace(
        "setStudentImage(item.image || '');\r\n    setEditingStudentId(item.id);",
        "setStudentImage(item.image || '');\r\n    setStudentEmail(item.email || '');\r\n    setStudentPhone(item.phone || '');\r\n    setStudentLinkedin(item.linkedin || '');\r\n    setEditingStudentId(item.id);"
    );
    content = content.replace(
        "setStudentImage(item.image || '');\n    setEditingStudentId(item.id);",
        "setStudentImage(item.image || '');\n    setStudentEmail(item.email || '');\n    setStudentPhone(item.phone || '');\n    setStudentLinkedin(item.linkedin || '');\n    setEditingStudentId(item.id);"
    );

    // 4. Add to saveInlineStudent
    content = content.replace(
        "society: studentSociety,\r\n            image: studentImage\r\n          }",
        "society: studentSociety,\r\n            image: studentImage,\r\n            email: studentEmail,\r\n            phone: studentPhone,\r\n            linkedin: studentLinkedin\r\n          }"
    );
    content = content.replace(
        "society: studentSociety,\n            image: studentImage\n          }",
        "society: studentSociety,\n            image: studentImage,\n            email: studentEmail,\n            phone: studentPhone,\n            linkedin: studentLinkedin\n          }"
    );

    // 5. Add to handleModalSubmit
    content = content.replace(
        "society: studentSociety,\r\n          image: studentImage\r\n        };\r\n        updated = [...students, newItem];",
        "society: studentSociety,\r\n          image: studentImage,\r\n          email: studentEmail,\r\n          phone: studentPhone,\r\n          linkedin: studentLinkedin\r\n        };\r\n        updated = [...students, newItem];"
    );
    content = content.replace(
        "society: studentSociety,\n          image: studentImage\n        };\n        updated = [...students, newItem];",
        "society: studentSociety,\n          image: studentImage,\n          email: studentEmail,\n          phone: studentPhone,\n          linkedin: studentLinkedin\n        };\n        updated = [...students, newItem];"
    );
    
    content = content.replace(
        "society: studentSociety,\r\n                image: studentImage\r\n              }\r\n            : item",
        "society: studentSociety,\r\n                image: studentImage,\r\n                email: studentEmail,\r\n                phone: studentPhone,\r\n                linkedin: studentLinkedin\r\n              }\r\n            : item"
    );
    content = content.replace(
        "society: studentSociety,\n                image: studentImage\n              }\n            : item",
        "society: studentSociety,\n                image: studentImage,\n                email: studentEmail,\n                phone: studentPhone,\n                linkedin: studentLinkedin\n              }\n            : item"
    );

    // 6. Table headers
    let th_old = `<th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', width: '13%' }}>Position</th>
                          <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', width: '12%' }}>Society</th>
                          <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', textAlign: 'center', width: '10%' }}>Actions</th>`;
    let th_new = `<th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', width: '13%' }}>Position</th>
                          <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', width: '12%' }}>Society</th>
                          <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', width: '15%' }}>Email</th>
                          <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', width: '12%' }}>Phone</th>
                          <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', width: '12%' }}>LinkedIn</th>
                          <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', textAlign: 'center', width: '10%' }}>Actions</th>`;
    content = content.replace(th_old.replace(/\n/g, '\r\n'), th_new.replace(/\n/g, '\r\n'));
    content = content.replace(th_old, th_new);

    // 7. inline edit tds
    let inline_old = `<td style={{ padding: '16px 20px', verticalAlign: 'middle', width: '12%' }}>
                                    <select
                                      value={studentSociety}
                                      onChange={(e) => setStudentSociety(e.target.value)}
                                      style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px', backgroundColor: '#ffffff' }}
                                    >
                                      <option value="IEEE KEC SB">IEEE KEC SB</option>
                                      {societies.map((s) => (
                                        <option key={s.id} value={s.name}>{s.name}</option>
                                      ))}
                                    </select>
                                  </td>
                                  <td style={{ padding: '16px 20px', verticalAlign: 'middle', textAlign: 'center', width: '10%' }}>`;
    let inline_new = `<td style={{ padding: '16px 20px', verticalAlign: 'middle', width: '12%' }}>
                                    <select
                                      value={studentSociety}
                                      onChange={(e) => setStudentSociety(e.target.value)}
                                      style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px', backgroundColor: '#ffffff' }}
                                    >
                                      <option value="IEEE KEC SB">IEEE KEC SB</option>
                                      {societies.map((s) => (
                                        <option key={s.id} value={s.name}>{s.name}</option>
                                      ))}
                                    </select>
                                  </td>
                                  <td style={{ padding: '16px 20px', verticalAlign: 'middle', width: '15%' }}>
                                    <input type="text" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }} />
                                  </td>
                                  <td style={{ padding: '16px 20px', verticalAlign: 'middle', width: '12%' }}>
                                    <input type="text" value={studentPhone} onChange={(e) => setStudentPhone(e.target.value)} style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }} />
                                  </td>
                                  <td style={{ padding: '16px 20px', verticalAlign: 'middle', width: '12%' }}>
                                    <input type="text" value={studentLinkedin} onChange={(e) => setStudentLinkedin(e.target.value)} style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }} />
                                  </td>
                                  <td style={{ padding: '16px 20px', verticalAlign: 'middle', textAlign: 'center', width: '10%' }}>`;
    content = content.replace(inline_old.replace(/\n/g, '\r\n'), inline_new.replace(/\n/g, '\r\n'));
    content = content.replace(inline_old, inline_new);

    // 8. display tds
    let display_old = `<td style={{ padding: '16px 20px', verticalAlign: 'middle', width: '12%' }}>
                                    <span style={{
                                      padding: '4px 10px',
                                      backgroundColor: '#eff6ff',
                                      color: '#1e40af',
                                      borderRadius: '4px',
                                      fontSize: '11px',
                                      fontWeight: '800'
                                    }}>
                                      {item.society}
                                    </span>
                                  </td>
                                  <td style={{ padding: '16px 20px', verticalAlign: 'middle', textAlign: 'center', width: '10%' }}>`;
    let display_new = `<td style={{ padding: '16px 20px', verticalAlign: 'middle', width: '12%' }}>
                                    <span style={{
                                      padding: '4px 10px',
                                      backgroundColor: '#eff6ff',
                                      color: '#1e40af',
                                      borderRadius: '4px',
                                      fontSize: '11px',
                                      fontWeight: '800'
                                    }}>
                                      {item.society}
                                    </span>
                                  </td>
                                  <td style={{ padding: '16px 20px', color: '#475569', verticalAlign: 'middle', width: '15%', wordBreak: 'break-all' }}>
                                    {item.email || <em style={{ color: '#cbd5e1' }}>Empty</em>}
                                  </td>
                                  <td style={{ padding: '16px 20px', color: '#475569', verticalAlign: 'middle', width: '12%' }}>
                                    {item.phone || <em style={{ color: '#cbd5e1' }}>Empty</em>}
                                  </td>
                                  <td style={{ padding: '16px 20px', color: '#475569', verticalAlign: 'middle', width: '12%' }}>
                                    {item.linkedin ? <a href={item.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#02619a', textDecoration: 'underline' }}>Link</a> : <em style={{ color: '#cbd5e1' }}>Empty</em>}
                                  </td>
                                  <td style={{ padding: '16px 20px', verticalAlign: 'middle', textAlign: 'center', width: '10%' }}>`;
    content = content.replace(display_old.replace(/\n/g, '\r\n'), display_new.replace(/\n/g, '\r\n'));
    content = content.replace(display_old, display_new);

    // 9. modal inputs
    let modal_old = `                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Society</label>
                    <select
                      value={studentSociety}`;
    let modal_new = `                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Email</label>
                      <input type="email" placeholder="e.g. student@kongu.edu" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Phone</label>
                      <input type="text" placeholder="e.g. +91 9876543210" value={studentPhone} onChange={(e) => setStudentPhone(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }} />
                    </div>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>LinkedIn Profile</label>
                    <input type="url" placeholder="e.g. https://linkedin.com/in/username" value={studentLinkedin} onChange={(e) => setStudentLinkedin(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Society</label>
                    <select
                      value={studentSociety}`;
    content = content.replace(modal_old.replace(/\n/g, '\r\n'), modal_new.replace(/\n/g, '\r\n'));
    content = content.replace(modal_old, modal_new);

    // 10. Default images
    content = content.replace('name: "Dr. S. Varadhaganapathy"', 'image: "/assets/faculty_male.png", name: "Dr. S. Varadhaganapathy"');
    content = content.replace('name: "Dr. P. Natesan"', 'image: "/assets/faculty_male_1.png", name: "Dr. P. Natesan"');
    content = content.replace('name: "Dr. R. Murugesan"', 'image: "/assets/faculty_male_2.png", name: "Dr. R. Murugesan"');
    content = content.replace('name: "Mr. S. Albert Alexander"', 'image: "/assets/faculty_male_3.png", name: "Mr. S. Albert Alexander"');
    content = content.replace('name: "Dr. J. Premalatha"', 'image: "/assets/faculty_female.png", name: "Dr. J. Premalatha"');
    content = content.replace('name: "Dr. S. Kalaiselvi"', 'image: "/assets/faculty_female_1.png", name: "Dr. S. Kalaiselvi"');
    content = content.replace('name: "Dr. N. Nithyadevi"', 'image: "/assets/faculty_female_2.png", name: "Dr. N. Nithyadevi"');
    content = content.replace('name: "Dr. A. Sheela"', 'image: "/assets/faculty_female_3.png", name: "Dr. A. Sheela"');
    content = content.replace('name: "Dr. K. Senthil Kumar"', 'image: "/assets/faculty_male_4.png", name: "Dr. K. Senthil Kumar"');
    content = content.replace('name: "Dr. G. Murugesan"', 'image: "/assets/faculty_male.png", name: "Dr. G. Murugesan"');
    content = content.replace('name: "Dr. T. Meeradevi"', 'image: "/assets/faculty_female_4.png", name: "Dr. T. Meeradevi"');
    content = content.replace('name: "Dr. K. Albert"', 'image: "/assets/faculty_male_1.png", name: "Dr. K. Albert"');

    fs.writeFileSync(filepath, content, 'utf8');
    console.log('Patched ' + filepath);
}

patchFile('d:\\IEEE\\src\\pages\\Admin.jsx');
patchFile('d:\\IEEE\\admin-panel\\src\\pages\\Admin.jsx');
patchFile('d:\\IEEE\\public-website\\src\\pages\\Admin.jsx');
