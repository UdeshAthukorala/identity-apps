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

export interface emailProvidersNS {
    heading: string;
    subHeading: string;
    description: string;
    info: string;
    updateButton: string;
    sendTestEmailButton: string;
    goBack: string;
    confirmationModal: {
        header: string;
        message: string;
        content: string;
        assertionHint: string;
    };
    buttons: {
        cancel: string;
        reset: string;
        submit: string;
        test: string;
    };
    dangerZoneGroup: {
        header: string;
        revertConfig: {
            heading: string;
            subHeading: string;
            actionTitle: string;
        };
    };
    form: {
        smtp: {
            subHeading: string;
            smtpServerHost: {
                label: string;
                placeholder: string;
                hint: string;
            };
            smtpPort: {
                label: string;
                placeholder: string;
                hint: string;
            };
            fromAddress: {
                label: string;
                placeholder: string;
                hint: string;
            };
            userName: {
                label: string;
                placeholder: string;
                hint: string;
            };
            password: {
                label: string;
                placeholder: string;
                hint: string;
            };
            displayName: {
                label: string;
                placeholder: string;
                hint: string;
            };
            replyToAddress: {
                label: string;
                placeholder: string;
                hint: string;
            };
            validations: {
                required: string;
                smtpPort: string;
                email: string;
            };
        };
        custom: {
            subHeading: string;
            authentication: {
                updateRequired: string;
            };
            providerURL: {
                label: string;
                placeholder: string;
                hint: string;
            };
            headers: {
                label: string;
                placeholder: string;
                hint: string;
            };
            contentType: {
                label: string;
                placeholder: string;
                hint: string;
            };
            httpMethod: {
                label: string;
                placeholder: string;
                hint: string;
            };
            payload: {
                label: string;
                placeholder: string;
                hint: string;
            };
            validations: {
                required: string;
                methodInvalid: string;
                contentTypeInvalid: string;
            };
        };
    };
    notifications: {
        getConfiguration: {
            error: {
                description: string;
                message: string;
            };
        };
        deleteConfiguration: {
            success: {
                description: string;
                message: string;
            };
            error: {
                description: string;
                message: string;
            };
        };
        updateConfiguration: {
            success: {
                description: string;
                message: string;
            };
            error: {
                description: string;
                message: string;
            };
        };
    };
}