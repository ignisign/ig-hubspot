import React, { useState } from "react";
import { Divider, Button, Text, Flex, hubspot , Input, Select, Option } from "@hubspot/ui-extensions";

hubspot.extend(({ context, runServerlessFunction, actions }) => (
  <Extension context={context} runServerless={runServerlessFunction} sendAlert={actions.addAlert} />
));



const FileBase64 = ({ multiple, onDone }) => {

  const [files, setFiles] = useState([]);

  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    setFiles(files);
    const allFiles = [];
    for (var i = 0; i < files.length; i++) {
      let file = files[i];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let fileInfo = {
          name: file.name,
          type: file.type,
          size: Math.round(file.size / 1000) + ' kB',
          base64: reader.result,
          file: file,
        };
        allFiles.push(fileInfo);
        if(allFiles.length == files.length){
          if(multiple) 
            onDone(allFiles);
          else 
            onDone(allFiles[0]);
        }
      }
    }
  }

  return (
    <input type="file" onChange={handleChange} multiple={multiple} />
  );
};




const Extension = ({ context, runServerless, sendAlert }) => {
  const [contact, setContact]           = useState({});
  const [signerid, setSignerid]         = useState("");
  const [signatureid, setSignatureid]   = useState("");
  const [loading, setLoading]           = useState(false);
  const [checkloading, setCheckloading] = useState(false);
  const [fileBase64, setFileBase64]     = useState("");
  const contactId = context.crm?.objectId;
  const [inputValue, setInputValue] = useState("");
  const [signatureStatus, setSignatureStatus] = useState("");

  console.log("contactId--- ", contactId);

  const fetchContact = async () => {
    if (!contactId) {
      sendAlert({ type: "error", message: "No contact ID found!" });
      return;
    }

    setLoading(true);
    try {
      const { response } = await runServerless({
        name: "fetchContact", // Serverless function name
        parameters: { contactID: contactId },
      });

      if (response?.success && response.contact) {
        setContact(response.contact); // Update state
        sendAlert({ type: "success", message: "Contact data fetched successfully!" });
        console.log('response.contact---- ', response.contact);
        // ✅ Pass data directly instead of using state
        // await createSigner(response.contact);
      } else {
        sendAlert({ type: "error", message: response.message || "Failed to fetch contact data!" });
      }
    } catch (error) {
      console.error("Error fetching contact:", error);
      sendAlert({ type: "error", message: "Server error while fetching contact." });
    } finally {
      setLoading(false);
    }
  };

  const createSigner = async (contactData) => {
    setLoading(true);
    console.log("contactData----- ", contactData);
    console.log("contactData-firstname----- ", contactData.firstname);

    try {
      const { response } = await runServerless({
        name: "createSigner",
        parameters: {
          firstname: contactData.firstname,
          lastname: contactData.lastname,
          email: contactData.email
        },
      });

      if (response?.success) {
        sendAlert({ type: "success", message: `Signer successfully! ID: ${response.signerId}` });
        setSignerid(response.signerId); 

        await documentDetail(contactData.document , contactData , response.signerId);

      } else {
        sendAlert({ type: "error", message: response.message || "Failed to create signer!" });
      }
    } catch (error) {
      console.error("Error creating signer:", error);
      sendAlert({ type: "error", message: "Server error while creating signer." });
    } finally {
      setLoading(false);
    }
  };

  const documentDetail = async (document , contactData , signerId) => {
    setLoading(true);
    console.log('contactData.document---- ' , contactData.document);
    try {
      const { response } = await runServerless({
        name: "documentDetail",
        parameters: {
          document: contactData.document,
        },
      });

      if (response?.success) {
        sendAlert({ type: "success", message: `Document Details successfully! ID: ${response.documentDetails}` });
        //setDocument(response.documentDetails);
        console.log('response.documentDetails---- ' , response.documentDetails);
        console.log('documentDetail---document----- ', document);
        console.log('documentDetail---contactData----- ', contactData);
        await sendSignature(response.documentDetails, contactData , signerId);
      } else {
        sendAlert({ type: "error", message: response.message || "Failed to Get Document Details!" });
      }
    } catch (error) {
      console.error("Error et Document Details:", error);
      sendAlert({ type: "error", message: "Server error while Get Document Details." });
    } finally {
      setLoading(false);
    }
  };

  const sendSignature = async (documentData , contactData , signerId) => {
    setLoading(true);
    try {
      const { response } = await runServerless({
        name: "sendSignature",
        parameters: {
          title: contactData.title,
          firstname: contactData.firstname,
          lastname: contactData.lastname,
          email: contactData.email,
          documentData: documentData,
          previous_document : contactData.document_ids
        },
      });

      if (response?.success) {
        sendAlert({ type: "success", message: `Send Signature To the user successfully! ID: ${response.signatureRequestId}` });
        console.log('sendSignature------ ',response.signatureRequestId);
        setSignatureid(response.signatureRequestId);
        updateContact(response.signatureRequestId , contactData , signerId)
      } else {
        sendAlert({ type: "error", message: response.message || "Failed to Signature To the user" });
      }
    } catch (error) {
      console.error("Error Signature To the user:", error);
      sendAlert({ type: "error", message: `Server error while Signature To the user. ${error.message}` });
    } 
    finally {
      setLoading(false);
    }
  };

  const updateContact = async (signatureRequestId , contactData , signerId) => {
    setLoading(true);
    console.log('updateContact - contactData--- ', contactData);
    console.log('updateContact - signerId--- ', signerId);
    console.log('updateContact - signatureRequestId--- ', signatureRequestId);
    let signatureRequest_Ids = signatureRequestId; 
    if (contactData.signature_request_id) {
        signatureRequest_Ids = contactData.signature_request_id + ',' + signatureRequestId;
    }
    const documentsIds = contactData.document;
    try {
      const { response } = await runServerless({
        name: "updateContact",
        parameters: {
          signer_id: signerId,
          signature_requestId: signatureRequest_Ids,
          contact_id : contactData.id,
          documents_ids : documentsIds
        },
      });

      if (response?.success) {
        sendAlert({ type: "success", message: `Contact Updated with the Signer ID, Signature Request ID and Documents ID's successfully!`});
        console.log('updateContact------ ',response);
        //setSignatureid(response.signatureRequestId);
      } else {
        sendAlert({ type: "error", message: response.message || "Failed to Contact Updated" });
      }
    } catch (error) {
      console.error("Error Contact Updated:", error);
      sendAlert({ type: "error", message: `Server error while Contact Updated. ${error.message}` });
    } 
    finally {
      setLoading(false);
    }
  };

  const checkSignatureStatus = async () => {
    setCheckloading(true);
    try {
      const { response } = await runServerless({
        name: "checkSignatureStatus",
        parameters: {
          input_value: inputValue,
        },
      });
  
      if (response?.success) {
        // Assuming the signature request status is available in response
        const status = response?.signatureRequests?.[0]?.status || "Unknown Status";
        sendAlert({ type: "success", message: `Signature Status is: ${status}` });
        
        setSignatureStatus(status);
        setCheckloading(false);
        console.log('Check Signature Status ------ ', response);
        
        // If you want to store the signature request ID
        const signatureRequestId = response?.signatureRequests?.[0]?.signatureRequestId;
        if (signatureRequestId) {
          setSignatureid(signatureRequestId); // Assuming you want to store this ID
          setCheckloading(false);
        }
      } else {
        sendAlert({ type: "error", message: response?.message || "Failed to retrieve Signature Status" });
      }
    } catch (error) {
      console.error("Error Signature Status:", error);
      sendAlert({  type: "error",  message: `Server error while checking Signature Status. ${error.message}`  });
    }
    finally {
      setCheckloading(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Get the base64 string by removing the prefix (data:file/type;base64,)
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };
  

  const ContactDetails = () => {
    return (
      <>
        <Text>Contact ID: {contactId || "Not available"}</Text>
        <Flex gap="small">
          <Text>First Name: {contact.firstname || "Not available"}</Text>
          <Text>Last Name: {contact.lastname || "Not available"}</Text>
          <Text>Email: {contact.email || "Not available"}</Text>
        </Flex>
      
      </>
    )
  }

  const SendSignatureRequest = () => {
    return (
      <>
        <Flex gap="small">
          <Text>Title: {contact.title || "Not available"}</Text>
        </Flex>

        <Flex gap="small">
          <FileBase64
            multiple={false}
            onDone={(file) => {
              setFileBase64(file.base64);
              console.log("File converted to base64:", file.base64);
            }}
          />
         
        </Flex>

        <Button 
            onClick={fetchContact} variant="primary" disabled={loading} loading={loading}>
            Send Signature Request
        </Button>
      
      </>
    )
  }


  const LastSignatureRequest = () => {
    return (
      <>
       <Flex gap="small">
        <Button
         variant="primary" disabled={loading} 
         onClick={checkSignatureStatus}  >
          Check Signature Status
        </Button>
      </Flex>
      </>
    )
  }



  return (
    <>
      <Flex direction="column" gap="xl">
        <ContactDetails />
        <Flex direction="row" gap="small">
          <SendSignatureRequest />
          <LastSignatureRequest />
        </Flex>
      </Flex>
     
     
     

      <Divider />
      {/* <Text format={{ fontWeight: "bold" }}>Copy the signature request ID, paste it into the input field below, and click on "Check Signature Status." The response will appear at the bottom along with the status.</Text>
      <Flex direction="row" align="end" gap="small">
        <Input name="text" label="Send" onInput={(t) => setInputValue(t)} />
        <Button type="submit" variant="destructive" onClick={handleClick} disabled={checkloading}>
        {checkloading ? "Checking..." : "Check Signature Status"}
        </Button>
      </Flex>
      <Text format={{ fontWeight: "bold" }}>Signature Status: {signatureStatus || "Not available"}</Text> */}
    </>
  );
};


/**/ 