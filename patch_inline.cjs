const fs = require('fs');
let content = fs.readFileSync('d:\\IEEE\\admin-panel\\src\\pages\\Admin.jsx', 'utf8');

// Patch saveInlineGallery
const oldInlineGallery = `  const saveInlineGallery = (id) => {
    if (!formTitle.trim() || !formText.trim()) return;
    const updated = galleryItems.map(item =>
      item.id === id
        ? { ...item, title: formTitle, cat: formCat, text: formText, images: formImages }
        : item
    );
    setGalleryItems(updated);
    settingsService.set('ieee_gallery_items', JSON.stringify(updated));
    setEditingGalleryId(null);
  };`;

const newInlineGallery = `  const saveInlineGallery = async (id) => {
    if (!formTitle.trim() || !formText.trim()) return;
    try {
      const payload = {
        title: formTitle,
        category: formCat,
        description: formText,
        images: formImages
      };
      const savedGallery = await galleryService.update(id, payload);
      const formattedItem = {
        id: savedGallery._id,
        title: savedGallery.title,
        cat: savedGallery.category,
        text: savedGallery.description,
        images: savedGallery.images || []
      };
      setGalleryItems(prev => prev.map(item => item.id === id ? formattedItem : item));
    } catch (err) {
      console.error('Error updating gallery inline:', err);
      alert('Error updating gallery item: ' + err.message);
    }
    setEditingGalleryId(null);
  };`;

content = content.replace(oldInlineGallery, newInlineGallery);

// Patch saveInlineEvent
const oldInlineEvent = `  const saveInlineEvent = (id) => {
    if (!eventTitle.trim() || !eventDesc.trim() || !eventDate.trim() || !eventVenue.trim()) return;
    
    const saveEvent = async () => {
      try {
        const updateData = eventIsUpcoming 
          ? { title: eventTitle, desc: eventDesc, date: eventDate, time: eventTime, venue: eventVenue, tag: eventTag, link: eventLink, isUpcoming: true }
          : { title: eventTitle, desc: eventDesc, date: eventDate, time: eventTime, venue: eventVenue, tag: eventTag, highlights: eventHighlights, isUpcoming: false };
          
        const response = await authFetch(\`\${API}/events/\${id}\`, {
          method: 'PUT',
          body: JSON.stringify(updateData)
        });
        
        if (!response.ok) throw new Error('Failed to update event inline');
        const savedEvent = await response.json();
        savedEvent.id = savedEvent._id;
        
        if (eventIsUpcoming) {
          const updated = upcomingEvents.map(item => item.id === id ? { ...item, ...savedEvent } : item);
          setUpcomingEvents(updated);
        } else {
          const updated = pastEvents.map(item => item.id === id ? { ...item, ...savedEvent } : item);
          setPastEvents(updated);
        }
      } catch (err) {
        console.error(err);
        alert('Error updating event: ' + err.message);
      }
      setEditingEventId(null);
    };
    saveEvent();
  };`;

const newInlineEvent = `  const saveInlineEvent = async (id) => {
    if (!eventTitle.trim() || !eventDesc.trim() || !eventDate.trim() || !eventVenue.trim()) return;
    
    try {
      const updateData = eventIsUpcoming 
        ? { title: eventTitle, desc: eventDesc, date: eventDate, time: eventTime, venue: eventVenue, tag: eventTag, link: eventLink, isUpcoming: true }
        : { title: eventTitle, desc: eventDesc, date: eventDate, time: eventTime, venue: eventVenue, tag: eventTag, highlights: eventHighlights, isUpcoming: false };
        
      const savedEvent = await eventService.update(id, updateData);
      savedEvent.id = savedEvent._id;
      
      if (eventIsUpcoming) {
        setUpcomingEvents(prev => prev.map(item => item.id === id ? { ...item, ...savedEvent } : item));
      } else {
        setPastEvents(prev => prev.map(item => item.id === id ? { ...item, ...savedEvent } : item));
      }
    } catch (err) {
      console.error('Error updating event inline:', err);
      alert('Error updating event: ' + err.message);
    }
    setEditingEventId(null);
  };`;

content = content.replace(oldInlineEvent, newInlineEvent);

fs.writeFileSync('d:\\IEEE\\admin-panel\\src\\pages\\Admin.jsx', content);
console.log('Successfully patched inline edits for gallery and events.');
