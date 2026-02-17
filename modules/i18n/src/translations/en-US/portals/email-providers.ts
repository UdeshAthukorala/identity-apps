/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { emailProvidersNS } from "../../../models";

export const emailProviders: emailProvidersNS = {
    confirmationModal: {
        assertionHint: "Please confirm your action.",
        content: "Deleting this email provider configuration may disrupt email notifications for " +
            "applications currently using it. You may no longer receive email-based notifications, which could " +
            "affect user communications. Please proceed with caution.",
        header: "Are you sure?",
        message: "This action is irreversible and will permanently delete the email provider configurations."
    },
    buttons: {
        cancel: "Cancel",
        reset: "Reset",
        submit: "Update",
        test: "Test Configuration"
    },
    dangerZoneGroup: {
        header: "Danger Zone",
        revertConfig: {
            actionTitle: "Delete",
            heading: "Delete Configurations",
            subHeading: "This action will delete email provider configurations. " +
                "Once deleted, you will not receive emails."
        }
    },
    description: "Configure the email provider credentials to enable sending email notifications.",
    form: {
        custom: {
            authentication: {
                updateRequired: "Please reconfigure the authentication details before proceeding."
            },
            contentType: {
                hint: "The content type of the API request. Accepted values are 'FORM' or 'JSON'",
                label: "Content Type",
                placeholder: "JSON or FORM"
            },
            httpMethod: {
                hint: "The HTTP method of the API request. (Default is POST)",
                label: "HTTP Method",
                placeholder: "POST"
            },
            payload: {
                hint: "The payload template of the API request. Use {{subject}} to represent the email subject. " +
                        "Use {{body}} to represent the email body. Use {{to}} to represent the recipient email address.",
                label: "Payload Template",
                placeholder: "{\"subject\": {{subject}}, \"body\": {{body}}, \"to\": {{to}} }"
            },
            providerURL: {
                hint: "The URL of the email provider API endpoint.",
                label: "Email Provider URL",
                placeholder: "Enter the email provider URL"
            },
            headers: {
                hint: "Comma seperated list of HTTP headers to be included in the Email API request.",
                label: "Headers",
                placeholder: "Comma seperated list of HTTP headers to be included in the Email API request."
            },
            subHeading: "Custom Email Provider Settings",
            validations: {
                contentTypeInvalid: "The content type is invalid",
                methodInvalid: "The HTTP method is invalid",
                required: "This field cannot be empty"
            }
        },
        smtp: {
            displayName: {
                hint: "The display name for the sender.",
                label: "Display Name",
                placeholder: "Enter display name"
            },
            fromAddress: {
                hint: "The email address from which emails will be sent.",
                label: "From Address",
                placeholder: "Enter the sender email address"
            },
            password: {
                hint: "The password for SMTP authentication.",
                label: "Password",
                placeholder: "Enter the password"
            },
            smtpPort: {
                hint: "The port number for the SMTP server. Common ports are 587 (TLS), 465 (SSL), or 25 (non-secure).",
                label: "SMTP Port",
                placeholder: "587"
            },
            smtpServerHost: {
                hint: "The hostname or IP address of the SMTP server.",
                label: "SMTP Server Host",
                placeholder: "Enter the SMTP server host"
            },
            subHeading: "SMTP Settings",
            userName: {
                hint: "The username for SMTP authentication.",
                label: "Username",
                placeholder: "Enter the username"
            },
            replyToAddress: {
                hint: "The email address to which replies will be sent (optional).",
                label: "Reply To Address",
                placeholder: "Enter the reply-to email address"
            },
            validations: {
                required: "This field cannot be empty",
                smtpPort: "Please enter a valid SMTP port number",
                email: "Please enter a valid email address"
            }
        }
    },
    goBack: "Go back to Notification Providers",
    heading: "Email Provider",
    info: "You can customize the email content using <1>Email Templates</1>.",
    notifications: {
        deleteConfiguration: {
            error: {
                description: "Error deleting the email provider configurations.",
                message: "Error Occurred"
            },
            success: {
                description: "Successfully reverted the email provider configurations.",
                message: "Revert Successful"
            }
        },
        getConfiguration: {
            error: {
                description: "Error retrieving the email provider configurations.",
                message: "Error Occurred"
            }
        },
        updateConfiguration: {
            error: {
                description: "Error updating the email provider configurations.",
                message: "Error Occurred"
            },
            success: {
                description: "Successfully updated the email provider configurations.",
                message: "Update Successful"
            }
        }
    },
    sendTestEmailButton: "Send Test Email",
    subHeading: "Configure an email provider to send emails to your users.",
    updateButton: "Update"
};