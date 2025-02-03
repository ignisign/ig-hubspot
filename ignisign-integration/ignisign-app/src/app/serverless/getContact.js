exports.main = async (context = {}) => {
  const { id } = context;
  
  try {
    const response = await context.sendHttpRequest({
      method: 'GET',
      url: `https://api.hubapi.com/crm/v3/objects/contacts/${id}`,
      headers: {
        'Authorization': `Bearer ${process.env.HUBSPOT_API_KEY}`
      }
    });

    const { properties } = response.body;
    
    return {
      email: properties.email || '',
      firstname: properties.firstname || '',
      lastname: properties.lastname || ''
    };
  } catch (error) {
    console.error('Error fetching contact:', error);
    throw error;
  }
}; 