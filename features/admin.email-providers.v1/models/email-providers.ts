/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import React from "react";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { AuthenticationType } from "../constants/email-provider-constants";

/**
 * The interface of the email provider config properties attribute.
 */
export interface EmailProviderConfigPropertiesInterface {
    key: string;
    value: string;
}

/**
 * The interface of the API response for email provider config editing.
 */
export interface EmailProviderConfigAPIResponseInterface {
    name?: string;
    smtpServerHost?: string;
    smtpPort?: number;
    fromAddress?: string;
    userName?: string;
    password?: string;
    authType?: string;
    properties?: EmailProviderConfigPropertiesInterface[];
}

/**
 * The interface for email provider config form.
 */
export interface EmailProviderConfigFormValuesInterface {
    smtpServerHost?: string;
    smtpPort?: number;
    fromAddress?: string;
    userName?: string;
    password?: string;
    displayName?: string;
    replyToAddress?: string;
    authType?: string;
    clientId?: string;
    clientSecret?: string;
    tokenEndpoint?: string;
    scopes?: string;
}

export interface EmailProviderConfigFormErrorValidationsInterface {
    smtpServerHost?: string;
    smtpPort?: string;
    fromAddress?: string;
    replyToAddress?: string;
    userName?: string;
    password?: string;
    displayName?: string;
    authType?: string;
    clientId?: string;
    clientSecret?: string;
    tokenEndpoint?: string;
    scopes?: string;
}

/**
 * Interface for email provider card.
 */
export interface EmailProviderCardInterface {
    icon: React.ReactElement;
    id: number;
    key: string;
    name: string;
}

/**
 * Interface for email provider state.
 */
export interface EmailProviderInterface {
    name?: string;
    provider?: string;
    authType?: AuthenticationType;
    // SMTP specific fields
    smtpServerHost?: string;
    smtpPort?: number;
    fromAddress?: string;
    userName?: string;
    password?: string;
    displayName?: string;
    replyToAddress?: string;
    // Custom provider specific fields
    providerURL?: string;
    contentType?: string;
    httpMethod?: string;
    payload?: string;
    headers?: string;
    // Authentication fields
    clientId?: string;
    clientSecret?: string;
    tokenEndpoint?: string;
    scopes?: string;
    accessToken?: string;
    header?: string;
    value?: string;
}

/**
 * Interface for email provider settings state.
 */
export interface EmailProviderSettingsState {
    providerParams: { [key: string]: EmailProviderInterface };
    selectedProvider: string;
}

/**
 * Prop-types for the email provider config page component.
 */
export type EmailProvidersPageInterface = IdentifiableComponentInterface
