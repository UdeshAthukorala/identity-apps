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

import Alert from "@oxygen-ui/react/Alert";
import AlertTitle from "@oxygen-ui/react/AlertTitle";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import {
    renderAuthenticationSectionInfoBox,
    renderInputAdornmentOfSecret,
    showAuthSecretsHint
} from "@wso2is/admin.core.v1/helpers/external-api-authentication-helpers";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { FinalFormField, SelectFieldAdapter, TextFieldAdapter } from "@wso2is/form";
import {
    EmphasizedSegment,
    Heading,
    Hint,
    PrimaryButton
} from "@wso2is/react-components";
import { FormApi } from "final-form";
import React, { FunctionComponent, MutableRefObject, ReactElement, useState } from "react";
import { FormSpy } from "react-final-form";
import { Trans, useTranslation } from "react-i18next";
import { Divider, Grid } from "semantic-ui-react";
import "@wso2is/admin.core.v1/styles/external-api-authentication.scss";
import { EmailProviderConstants, AuthenticationType, DropdownChild } from "../constants/email-provider-constants";
import "./email-providers.scss";

interface CustomEmailProviderPageInterface extends IdentifiableComponentInterface {
    isLoading?: boolean;
    isReadOnly: boolean;
    "data-componentid": string;
    onSubmit: (values: any) => void;
    hasExistingConfig?: boolean;
    currentAuthType?: AuthenticationType;
    endpointAuthType: AuthenticationType;
    setEndpointAuthType: (authType: AuthenticationType) => void;
    isAuthenticationUpdateFormState: boolean;
    setIsAuthenticationUpdateFormState: (state: boolean) => void;
    formState: MutableRefObject<FormApi<Record<string, unknown>, Partial<Record<string, unknown>>>>;
    onAuthenticationChange: () => void;
}

const CustomEmailProvider: FunctionComponent<CustomEmailProviderPageInterface> = (
    props: CustomEmailProviderPageInterface
): ReactElement => {

    const {
        ["data-componentid"]: componentId,
        isLoading,
        isReadOnly,
        onSubmit,
        hasExistingConfig,
        currentAuthType,
        endpointAuthType,
        setEndpointAuthType,
        isAuthenticationUpdateFormState,
        setIsAuthenticationUpdateFormState,
        formState,
        onAuthenticationChange
    } = props;

    const { t } = useTranslation();

    const [ showPrimarySecret, setShowPrimarySecret ] = useState<boolean>(false);
    const [ showSecondarySecret, setShowSecondarySecret ] = useState<boolean>(false);
    const [ localAuthType, setLocalAuthType ] = useState<AuthenticationType>(endpointAuthType);
    const [ shouldShowAuthUpdateAlert, setShouldShowAuthUpdateAlert ] = useState<boolean>(false);

    const handleDropdownChange = (value: string) => {
        const authType: AuthenticationType = value as AuthenticationType;

        setLocalAuthType(authType);
        setEndpointAuthType(authType);
    };

    /**
     * Resets all authentication fields to their initial values to preserve existing data.
     * This is called when the user cancels editing the authentication configuration.
     */
    const resetAuthenticationFields = (): void => {
        if (formState.current) {
            const initialValues: Partial<Record<string, unknown>> = formState.current.getState()?.initialValues;

            formState.current.change("authType", initialValues?.authType ?? undefined);
            formState.current.change("userName", initialValues?.userName ?? "");
            formState.current.change("password", initialValues?.password ?? "");
            formState.current.change("clientId", initialValues?.clientId ?? "");
            formState.current.change("clientSecret", initialValues?.clientSecret ?? "");
            formState.current.change("tokenEndpoint", initialValues?.tokenEndpoint ?? "");
            formState.current.change("scopes", initialValues?.scopes ?? "");
            formState.current.change("accessToken", initialValues?.accessToken ?? "");
            formState.current.change("header", initialValues?.header ?? "");
            formState.current.change("value", initialValues?.value ?? "");
        }
    };

    const activeAuthType: AuthenticationType = localAuthType || endpointAuthType;

    return (
        <EmphasizedSegment
            padded={ "very" }
            data-componentid={ `${componentId}-tab` }
        >
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column>
                        <h2>{ t("emailProviders:form.custom.subHeading") }</h2>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 2 }>
                    <Grid.Column>
                        <FinalFormField
                            key="providerURL"
                            fullWidth
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            ariaLabel="providerURL"
                            readOnly={ isReadOnly }
                            required={ true }
                            data-componentid={ `${componentId}-providerURL` }
                            name="providerURL"
                            type="text"
                            label={ t("emailProviders:form.custom.providerURL.label") }
                            placeholder={ t("emailProviders:form.custom." +
                                "providerURL.placeholder") }
                            helperText={ (
                                <Hint compact>
                                    { t("emailProviders:form.custom.providerURL.hint") }
                                </Hint>
                            ) }

                            component={ TextFieldAdapter }
                            maxLength={
                                EmailProviderConstants.EMAIL_PROVIDER_CONFIG_FIELD_MAX_LENGTH
                            }
                            minLength={
                                EmailProviderConstants.EMAIL_PROVIDER_CONFIG_FIELD_MIN_LENGTH
                            }
                            autoComplete="new-password"
                        />
                    </Grid.Column>
                    <Grid.Column>
                        <FinalFormField
                            key="contentType"
                            fullWidth
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            ariaLabel="contentType"
                            readOnly={ isReadOnly }
                            data-componentid={ `${componentId}-contentType` }
                            name="contentType"
                            type="text"
                            label={ t("emailProviders:form.custom.contentType.label") }
                            placeholder={ t("emailProviders:form.custom." +
                                "contentType.placeholder") }
                            helperText={ (
                                <Hint compact>
                                    The content type of the API request. Accepted values are 'FORM' or 'JSON'
                                </Hint>
                            ) }
                            component={ TextFieldAdapter }
                            maxLength={
                                EmailProviderConstants.EMAIL_PROVIDER_CONFIG_FIELD_MAX_LENGTH
                            }
                            minLength={
                                EmailProviderConstants.EMAIL_PROVIDER_CONFIG_FIELD_MIN_LENGTH
                            }
                            autoComplete="new-password"
                            required
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 2 }>
                    <Grid.Column>
                        <FinalFormField
                            key="httpMethod"
                            fullWidth
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            ariaLabel="httpMethod"
                            readOnly={ isReadOnly }
                            required={ true }
                            data-componentid={ `${componentId}-httpMethod` }
                            name="httpMethod"
                            type="text"
                            label={ t("emailProviders:form.custom.httpMethod.label") }
                            placeholder={ t("emailProviders:form.custom.httpMethod.placeholder") }
                            helperText={ (
                                <Hint compact>
                                     { t("emailProviders:form.custom.httpMethod.hint") }
                                </Hint>
                            ) }
                            component={ TextFieldAdapter }
                            maxLength={ 10 }
                            minLength={ 3 }
                            autoComplete="new-password"
                        />
                    </Grid.Column>
                    <Grid.Column>
                        <FinalFormField
                            key="headers"
                            fullWidth
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            ariaLabel="headers"
                            readOnly={ isReadOnly }
                            data-componentid={ `${componentId}-headers` }
                            name="headers"
                            type="text"
                            label={ t("emailProviders:form.custom.headers.label") }
                            placeholder={ t("emailProviders:form.custom." +
                                "headers.placeholder") }
                            helperText={ (
                                <Hint compact>
                                    Comma seperated list of HTTP headers to be included in the Email API request.
                                </Hint>
                            ) }
                            component={ TextFieldAdapter }
                            maxLength={ 1024 }
                            minLength={ 0 }
                            autoComplete="new-password"
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column>
                        <FinalFormField
                            key="payload"
                            fullWidth
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            ariaLabel="payload"
                            readOnly={ isReadOnly }
                            data-componentid={ `${componentId}-payload` }
                            name="payload"
                            type="text"
                            label={ t("emailProviders:form.custom.payload.label") }
                            placeholder={ t("emailProviders:form.custom." +
                                "payload.placeholder") }
                            helperText={ (
                                <Hint compact>
                                    { t("emailProviders:form.custom.payload.hint") }
                                </Hint>
                            ) }
                            component={ TextFieldAdapter }
                            maxLength={ 2048 }
                            minLength={
                                EmailProviderConstants.EMAIL_PROVIDER_CONFIG_FIELD_MIN_LENGTH
                            }
                            autoComplete="new-password"
                        />
                    </Grid.Column>
                </Grid.Row>

                <div className="authentication-container">
                    <Divider className="divider-container" />
                    <Heading className="heading-container" as="h5">
                        { t("externalApiAuthentication:fields.authenticationTypeDropdown.title") }
                    </Heading>

                    { (
                        (!hasExistingConfig || isAuthenticationUpdateFormState || !currentAuthType)
                    ) && (
                        <Box className="box-container">
                            <div className="box-field">
                                {
                                    (
                                        hasExistingConfig &&
                                        isAuthenticationUpdateFormState &&
                                        shouldShowAuthUpdateAlert
                                    ) && (
                                        <Alert
                                            severity="warning"
                                            className="authentication-update-alert"
                                            sx={ { mb: 2 } }
                                        >
                                            { t("emailProviders:form.custom.authentication.updateRequired") }
                                        </Alert>
                                    )
                                }
                                <FormSpy subscription={ { values: true } }>
                                    { ({ values }: { values: Record<string, unknown> }) => {
                                        const currentAuthType: string = values?.authType as string;

                                        if (currentAuthType && currentAuthType !== activeAuthType) {
                                            handleDropdownChange(currentAuthType);
                                        }

                                        return null;
                                    } }
                                </FormSpy>
                                <FinalFormField
                                    key="authType"
                                    ariaLabel="authType"
                                    readOnly={ isReadOnly }
                                    required={ true }
                                    data-componentid={ `${componentId}-authentication-dropdown` }
                                    name="authType"
                                    label={ t(
                                        "externalApiAuthentication:fields." +
                                        "authenticationTypeDropdown.label"
                                    ) }
                                    placeholder={ t(
                                        "externalApiAuthentication:fields." +
                                        "authenticationTypeDropdown.placeholder"
                                    ) }
                                    options={ EmailProviderConstants.AUTH_TYPES.map(
                                        (option: DropdownChild) => ({
                                            key: option.key,
                                            text: t(option.text),
                                            value: option.value
                                        })
                                    ) }
                                    component={ SelectFieldAdapter }
                                />
                                {
                                    showAuthSecretsHint(
                                        !!hasExistingConfig,
                                        t,
                                        Hint
                                    )
                                }

                                { activeAuthType === AuthenticationType.BASIC && (
                                    <>
                                        <FinalFormField
                                            key="userName"
                                            ariaLabel="username"
                                            className="addon-field-wrapper"
                                            name="userName"
                                            type={ showPrimarySecret ? "text" : "password" }
                                            required={ true }
                                            data-componentid={
                                                `${componentId}-endpoint-authentication-property-username`
                                            }
                                            label={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties.username.label"
                                            ) }
                                            placeholder={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties.username.placeholder"
                                            ) }
                                            component={ TextFieldAdapter }
                                            maxLength={ 100 }
                                            readOnly={ isReadOnly }
                                            InputProps={ {
                                                endAdornment: renderInputAdornmentOfSecret(
                                                    showPrimarySecret,
                                                    () => setShowPrimarySecret(!showPrimarySecret),
                                                    componentId
                                                )
                                            } }
                                        />
                                        <FinalFormField
                                            key="password"
                                            ariaLabel="password"
                                            className="addon-field-wrapper"
                                            name="password"
                                            type={ showSecondarySecret ? "text" : "password" }
                                            required={ true }
                                            data-componentid={
                                                `${componentId}-endpoint-authentication-property-password`
                                            }
                                            label={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties.password.label"
                                            ) }
                                            placeholder={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties.password.placeholder"
                                            ) }
                                            component={ TextFieldAdapter }
                                            maxLength={ 100 }
                                            readOnly={ isReadOnly }
                                            InputProps={ {
                                                endAdornment: renderInputAdornmentOfSecret(
                                                    showSecondarySecret,
                                                    () => setShowSecondarySecret(!showSecondarySecret),
                                                    componentId
                                                )
                                            } }
                                        />
                                    </>
                                ) }

                                { activeAuthType === AuthenticationType.CLIENT_CREDENTIAL && (
                                    <>
                                        <FinalFormField
                                            key="clientId"
                                            ariaLabel="clientId"
                                            className="addon-field-wrapper"
                                            name="clientId"
                                            type="text"
                                            required={ true }
                                            data-componentid={
                                                `${componentId}-endpoint-authentication-property-clientId`
                                            }
                                            label={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties." +
                                                "clientId.label"
                                            ) }
                                            placeholder={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties." +
                                                "clientId.placeholder"
                                            ) }
                                            component={ TextFieldAdapter }
                                            maxLength={ 100 }
                                            readOnly={ isReadOnly }
                                        />
                                        <FinalFormField
                                            key="clientSecret"
                                            ariaLabel="clientSecret"
                                            className="addon-field-wrapper"
                                            name="clientSecret"
                                            type={ showSecondarySecret ? "text" : "password" }
                                            required={ true }
                                            data-componentid={
                                                `${componentId}-endpoint-authentication-property-clientSecret`
                                            }
                                            label={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties." +
                                                "clientSecret.label"
                                            ) }
                                            placeholder={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties." +
                                                "clientSecret.placeholder"
                                            ) }
                                            component={ TextFieldAdapter }
                                            maxLength={ 100 }
                                            readOnly={ isReadOnly }
                                            InputProps={ {
                                                endAdornment: renderInputAdornmentOfSecret(
                                                    showSecondarySecret,
                                                    () => setShowSecondarySecret(!showSecondarySecret),
                                                    componentId
                                                )
                                            } }
                                        />
                                        <FinalFormField
                                            key="tokenEndpoint"
                                            ariaLabel="tokenEndpoint"
                                            className="addon-field-wrapper"
                                            name="tokenEndpoint"
                                            type="text"
                                            required={ true }
                                            data-componentid={
                                                `${componentId}-endpoint-authentication-property-tokenEndpoint`
                                            }
                                            label={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties." +
                                                "tokenEndpoint.label"
                                            ) }
                                            placeholder={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties." +
                                                "tokenEndpoint.placeholder"
                                            ) }
                                            component={ TextFieldAdapter }
                                            maxLength={ 2048 }
                                            readOnly={ isReadOnly }
                                        />
                                        <FinalFormField
                                            key="scopes"
                                            ariaLabel="scopes"
                                            className="addon-field-wrapper"
                                            name="scopes"
                                            type="text"
                                            required={ false }
                                            data-componentid={
                                                `${componentId}-endpoint-authentication-property-scopes`
                                            }
                                            label={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties." +
                                                "scopes.label"
                                            ) }
                                            placeholder={ t(
                                                "externalApiAuthentication:fields." +
                                                "authenticationTypeDropdown.authProperties." +
                                                "scopes.placeholder"
                                            ) }
                                            component={ TextFieldAdapter }
                                            maxLength={ 500 }
                                            readOnly={ isReadOnly }
                                        />
                                    </>
                                ) }

                                { isAuthenticationUpdateFormState && (
                                    <Button
                                        onClick={ () => {
                                            setShouldShowAuthUpdateAlert(false);
                                            setIsAuthenticationUpdateFormState(false);
                                            setLocalAuthType(currentAuthType);
                                            setEndpointAuthType(currentAuthType);
                                            resetAuthenticationFields();
                                        } }
                                        variant="outlined"
                                        size="small"
                                        className="secondary-button"
                                        data-componentid={ `${componentId}-cancel-edit-authentication-button` }
                                    >
                                        { t("actions:buttons.cancel") }
                                    </Button>
                                ) }
                            </div>
                        </Box>
                    ) }

                    {
                        (hasExistingConfig && !isAuthenticationUpdateFormState && currentAuthType) &&
                        renderAuthenticationSectionInfoBox(
                            currentAuthType,
                            componentId,
                            t,
                            onAuthenticationChange,
                            Alert,
                            AlertTitle,
                            Trans,
                            Button
                        )
                    }
                </div>

                {/* Update Button - Right aligned, after payload before authentication */}
                {
                    !isReadOnly && (
                        <Grid.Row columns={ 1 }>
                            <Grid.Column textAlign="left">
                                <PrimaryButton
                                    size="small"
                                    type="button"
                                    onClick={ () => {
                                        if (
                                            hasExistingConfig &&
                                            currentAuthType &&
                                            !isAuthenticationUpdateFormState
                                        ) {
                                            setShouldShowAuthUpdateAlert(true);
                                            setIsAuthenticationUpdateFormState(true);
                                        } else {
                                            onSubmit(formState.current?.getState().values);
                                        }
                                    } }
                                    ariaLabel="Email provider form update button"
                                    data-componentid={ `${componentId}-update-button` }
                                    loading={ isLoading }
                                >
                                    { t("emailProviders:buttons.submit") }
                                </PrimaryButton>
                            </Grid.Column>
                        </Grid.Row>
                    )
                }

            </Grid>
        </EmphasizedSegment>
    );
};

CustomEmailProvider.defaultProps = {
    "data-componentid": "custom-email-provider"
};

export default CustomEmailProvider;