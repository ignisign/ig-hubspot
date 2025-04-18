const axios = require('axios');

exports.main = async (context) => {

  const inputValue = context.parameters.input_value;
  
  try {
  
    const payload = {
      signatureRequestIds: [
        inputValue
      ]
    }

    const response = await axios.post(
      'https://api.ignisign.io/v4/applications/appId_ae85b0c9-8658-4f1e-a8c2-4fb8b52430e2/envs/DEVELOPMENT/signature-requests/status',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6ImFwcElkX2FlODViMGM5LTg2NTgtNGYxZS1hOGMyLTRmYjhiNTI0MzBlMiIsImFwcEVudiI6IkRFVkVMT1BNRU5UIiwiY2xhaW1zVHlwZSI6IkFQUF9BUEkiLCJpYXQiOjE3NDE4NTI4NDgsImV4cCI6MTc0MTkzOTI0OH0.kIMlGUc5gXjvgUMNgYLa2IqgDi8SGorJNL6VfweFEbsUQSNjlCEqDhFQYRmFe0VFbo6_4fTLm66dCnYog2SxLJl-HjzmzI8ik0Co6316jRGAh0zivthTsTEb1gMIYdh1PZH3X-vXLzsG6eDM9VXsw76_FikZJz58tjvA4vz08x9yBeqdCg7OfMyiTmHO2Ix5ASuNKi04TuPbFYk7IRXvPEmg8x-xZwJ4Qw8XvrYuxR_i99we16ZFyNRYlyoe_hMartH4tnJHZ0cpkk8y76NrZQbtm9OdC3ggh8aRaxUiyLAqcP0ZhfP3gmBp6vSO1bnxbzhhsltViwavEJCzumu-Oh0IbjW4vdBHdy9jnIV-76wGlW8Wl4JeHNNa3rDun__nxlDQ7k82ChGxuHhAVkZ5jYJ8RTO_vT-IWgxubKhl8WZwni7etnJz1s57xvMZTfITGnPhUagWDaOdrPXNNCC42Q2LnpMucGLnk-bN6Y_v3w8vla_ilVzAWgUYWx9NSPTFucY_wvyFpZlR6rWX8UhGshTc3EhI6Mt_El1ygIWPA1wgQnSVVXn5zevgHBWJ0wt5gY9eg4R1XGbtlEq6Fom4GCUbzEfVyZBLB6hMbEaxyrP5Ls6bywCIG2TuO4ZEcLonOCd1PzDVyfIMxkSCtr8Zg0pneSwmJs7FjDFAUpVRtPU',
        }
      }
    );


    return {
      success: true,
      signatureRequests: response.data.signatureRequests,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
