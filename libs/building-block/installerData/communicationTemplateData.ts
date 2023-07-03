import { CommunicationTemplateCreator } from 'als/building-block/RequestableDto/CommunicationTemplate/CommunicationTemplateCreator';
import { ObjectId } from 'mongodb';

export const communicationTemplatesData: CommunicationTemplateCreator[] = [
  {
    template_name: 'Update Auto Notification',
    template_type: 'AutoNotification Update',
    template:
      '<p style="text-align:start;"><span style="color: rgb(29,29,29);background-color: rgb(255,255,255);font-size: 14px;font-family: Sf Pro Display Regular", sans-serif;">Dear #contactFirstName# #contactLastName#</span></p>\n<p><span style="color: rgb(29,29,29);background-color: rgb(255,255,255);font-size: 14px;font-family: Sf Pro Display Regular", sans-serif;"><br></span>Our records indicate that the COI or policy endorsements that we have on file for, <span style="color: rgb(29,29,29);background-color: rgb(255,255,255);font-size: 14px;font-family: Sf Pro Display Regular", sans-serif;">#vendorName#, against project #projectName#, of client #clientName# <strong>are expiring soon.</strong></span></p>\n<p><span style="color: rgb(29,29,29);background-color: rgb(255,255,255);font-size: 14px;font-family: Sf Pro Display Regular", sans-serif;">Here are the coverage and limit requirements that are not met:<br><br>##deficienciesList##</span></p>\n<p style="text-align:start;"></p>\n<p style="text-align:left;"><span style="color: rgb(29,29,29);background-color: rgb(255,255,255);font-size: 14px;font-family: Sf Pro Display Regular", sans-serif;">The following documents are also expiring</span></p>\n<p style="text-align:left;"><span style="color: rgb(29,29,29);background-color: rgb(255,255,255);font-size: 14px;font-family: Sf Pro Display Regular", sans-serif;">##documentList##</span></p>\n<p style="text-align:start;"></p>\n<p style="text-align:left;"><span style="color: rgb(29,29,29);background-color: rgb(255,255,255);font-size: 14px;font-family: Sf Pro Display Regular", sans-serif;"><strong>Please click the link down below to submit documents or simply reply to this email with your updated COI attached.</strong><br><br><div style="display: flex; justify-content: center;"><a href="#dashboardlink#" target="_blank"><button style="background-color: #00B8CE; color: #fff; border-radius: 10px; padding: 10px 20px; border: none;">Go to Dashboard</button></a></div><br><br>Thank you for your time and attention as we maintain compliance with our records.<br><br><br>Regards,<br><br></span></p>\n<p style="text-align:start;"></p>\n<p style="text-align:left;"><span style="color: rgb(29,29,29);background-color: rgb(255,255,255);font-size: 14px;font-family: Sf Pro Display Regular", sans-serif;"><br><br>If you have questions regarding this certificate request, please reply to this email.<br><br>If you have issues uploading your certificate, please email </span><a href="mailto:support@smartcompliance.co" target="_self"><span style="color: var(--bs-link-color);background-color: rgb(255,255,255);font-size: 14px;font-family: Sf Pro Display Regular", sans-serif;"><ins>support@theriskcomply.co</ins></span></a></p>\n<p style="text-align:start;"></p>\n<p style="text-align:left;">&nbsp;</p>\n<p style="text-align:start;"></p>\n<p style="text-align:left;"><span style="color: rgb(29,29,29);background-color: rgb(255,255,255);font-size: 14px;font-family: Sf Pro Display Regular", sans-serif;">To stop receiving these communications please unsubscribe</span></p>\n',
    subject: 'Expiring Compliance Documents and Deficiency List',
    created_by: new ObjectId(),
    tags: [],
    system_generated: true,
  },
  {
    template_name: 'Request Auto Notification',
    template_type: 'AutoNotification Request',
    template:
      '<p>Dear <span style="color: rgb(29,29,29);background-color: rgb(255,255,255);font-size: 14px;font-family: Sf Pro Display Regular", sans-serif;">#contactFirstName#  #contactLastName#</span><br>Our records indicate the current COI we have on file for your company, <span style="color: rgb(29,29,29);background-color: rgb(255,255,255);font-size: 14px;font-family: Sf Pro Display Regular", sans-serif;">#vendorName#</span>, against project #projectName#, of client #clientName# does not meet all of the coverage and limit requirements laid out in our contract. Here are the coverage and limit requirements that are not met:<br><br>##deficienciesList##</p>\n<p></p>\n<p>The following documents are also missing</p>\n<p></p>\n<p>##documentList##</p>\n<p></p>\n<p><strong>Please click the link down below to submit documents or simply reply to this email with your updated COI attached.</strong><br><br><div style="display: flex; justify-content: center;"><a href="#dashboardlink#" target="_blank"><button style="background-color: #00B8CE; color: #fff; border-radius: 10px; padding: 10px 20px; border: none;">Go to Dashboard</button></a></div><br><br>Thank you for your time and attention as we maintain compliance with our records.<br><br><br>Regards,<br></p>\n<p><br><br>If you have questions regarding this certificate request, please reply to this email.<br><br>If you have issues uploading your certificate, please email <a href="mailto:support@smartcompliance.co" target="_self">support@theriskcomply.co</a></p>\n<p> </p>\n<p>To stop receiving these communications please unsubscribe</p>\n',
    subject: 'Outstanding Compliance Documents and Deficiency List',
    created_by: new ObjectId(),
    tags: [],
    system_generated: true,
  },
  {
    template_name: 'General Communication',
    template_type: 'General Communication',
    template:
      '<p>Dear #contactFirstName# #contactLastName#,<br><br><br>Our records indicate we need an updated COI on file for your company. Find attached a sample certificate that reflects all requirements to meet compliance. <br><br><br>Location: <br><br>#vendorAddress1# , #vendorCity# , #vendorState# , #vendorZipCode#<br><br><br>Certificate Requirements:<br><br>##deficienciesList##<br><br><br><br>The following must be listed as Cert Holder and listed as ADDITIONAL INSURED:<br><br></p>\n<p><strong>Please click the link down below to submit documents or simply reply to this email with your COI attached.</strong><br><br><div style="display: flex; justify-content: center;"><a href="#dashboardlink#" target="_blank"><button style="background-color: #00B8CE; color: #fff; border-radius: 10px; padding: 10px 20px; border: none;">Go to Dashboard</button></a></div><br><br>Thank you for your time and attention as we maintain compliance with our records.<br><br><br>Regards,</p>\n',
    subject: 'Deficiency List',
    created_by: new ObjectId(),
    tags: [],
    system_generated: true,
  },
  {
    template_name: 'Project Communication',
    template_type: 'Project Communication',
    template:
      '<p style="text-align:start;"></p>\n<p><span style="color: rgb(29,29,29);background-color: rgb(255,255,255);font-size: 14px;font-family: Sf Pro Display Regular", sans-serif;">Dear #contactFirstName# #contactLastName#,<br><br><br>Our records indicate we need an updated COI on file for your company #vendorName# for project #projectName#. Find attached a sample certificate that reflects all requirements to meet compliance.<br><br><br>Location:<br><br>#vendorAddress1# , #vendorCity# , #vendorState# , #vendorZipCode#<br><br><br>Certificate Requirements:<br><br>##deficienciesList##<br><br><br><br>The following must be listed as Cert Holder and listed as ADDITIONAL INSURED:<br><br></span></p>\n<p style="text-align:left;"><span style="color: rgb(29,29,29);background-color: rgb(255,255,255);font-size: 14px;font-family: Sf Pro Display Regular", sans-serif;"><strong>Please click the link down below to submit documents or simply reply to this email with your COI attached.</strong><br><br><div style="display: flex; justify-content: center;"><a href="#dashboardlink#" target="_blank"><button style="background-color: #00B8CE; color: #fff; border-radius: 10px; padding: 10px 20px; border: none;">Go to Dashboard</button></a></div><br><br>Thank you for your time and attention as we maintain compliance with our records.<br><br><br>Regards,</span></p>\n',
    subject: 'Deficiency list of Project',
    created_by: new ObjectId(),
    tags: [],
    system_generated: true,
  },
];
