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

import { Show, useRequiredScopes } from "@wso2is/access-control";
import { AppState } from "@wso2is/admin.core.v1/store";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalForm, FormRenderProps } from "@wso2is/form";
import {
    ConfirmationModal,
    DangerZone,
    DangerZoneGroup,
    InfoCard,
    PageLayout
} from "@wso2is/react-components";
import { FormApi } from "final-form";
import React, { Dispatch, FunctionComponent, MutableRefObject, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Placeholder } from "semantic-ui-react";
import CustomEmailProvider from "./custom-email-provider";
import SMTPEmailProvider from "./smtp-email-provider";
import { deleteEmailProviderConfigurations, updateEmailProviderConfigurations, useEmailProviderConfig } from "../api";
import { EmailProviderCardInterface, providerCards } from "../configs/provider-cards";
import { AuthenticationType, EmailProviderConstants } from "../constants/email-provider-constants";
import {
    EmailProviderInterface,
    EmailProviderSettingsState,
    EmailProvidersPageInterface
} from "../models/email-providers";
import "./email-providers.scss";

/**
 * Multi-Provider Email Providers page with support for SMTP and Custom providers.
 *
 * @param props - Props injected to the component.
 * @returns Multi-Provider Email Providers config page component.
 */
const MultiProviderEmailProvidersPage: FunctionComponent<EmailProvidersPageInterface> = (
    props: EmailProvidersPageInterface
): ReactElement => {
    const {
        ["data-componentid"]: componentId
    } = props;

    const dispatch: Dispatch<any> = useDispatch();
    const { t } = useTranslation();

    const featureConfig: any = useSelector((state: AppState) => state.config.ui.features);
    const hasEmailProviderUpdatePermissions: boolean = useRequiredScopes(featureConfig?.emailProviders?.scopes?.update);

    const formStateRef: MutableRefObject<FormApi> = useRef<FormApi>(null);

    const [ isLoading, setIsLoading ] = useState(true);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isDeleting, setIsDeleting ] = useState<boolean>(false);
    const [ isOpenRevertConfigModal, setOpenRevertConfigModal ] = useState<boolean>(false);
    const [ isAuthenticationUpdateFormState, setIsAuthenticationUpdateFormState ] = useState<boolean>(false);
    const [ endpointAuthType, setEndpointAuthType ] = useState<AuthenticationType>(null);
    const [ existingEmailProviders, setExistingEmailProviders ] = useState<string[]>([]);

    const defaultProviderParams: { [key: string]: EmailProviderInterface } = {
        [EmailProviderConstants.SMTP_EMAIL_PROVIDER]: {
            name: EmailProviderConstants.EMAIL_PROVIDER_CONFIG_NAME,
            provider: EmailProviderConstants.SMTP_EMAIL_PROVIDER,
            smtpServerHost: "",
            smtpPort: 587,
            fromAddress: "",
            userName: "",
            password: "",
            displayName: "",
            replyToAddress: ""
        },
        [EmailProviderConstants.CUSTOM_EMAIL_PROVIDER]: {
            name: EmailProviderConstants.EMAIL_PROVIDER_CONFIG_NAME,
            provider: EmailProviderConstants.CUSTOM_EMAIL_PROVIDER,
            providerURL: "",
            contentType: "",
            httpMethod: "",
            payload: "",
            headers: ""
        }
    };

    const [ emailProviderSettings, setEmailProviderSettings ] = useState<EmailProviderSettingsState>({
        providerParams: defaultProviderParams,
        selectedProvider: EmailProviderConstants.SMTP_EMAIL_PROVIDER
    });

    const {
        data: originalEmailProviderConfig,
        isLoading: isEmailProviderConfigFetchRequestLoading,
        mutate: mutateEmailProviderConfig
    } = useEmailProviderConfig();

    useEffect(() => {
        if (!isEmailProviderConfigFetchRequestLoading) {
            const existingProviderNames: string[] = [];

            if (originalEmailProviderConfig && originalEmailProviderConfig[0]) {
                const provider: any = originalEmailProviderConfig[0];
                
                // Check if it's SMTP (default) or Custom provider
                if (provider.smtpServerHost || provider.fromAddress) {
                    // It's SMTP configuration
                    existingProviderNames.push(EmailProviderConstants.SMTP_EMAIL_PROVIDER);
                    
                    const smtpProvider: EmailProviderInterface = {
                        name: provider.name,
                        provider: EmailProviderConstants.SMTP_EMAIL_PROVIDER,
                        smtpServerHost: provider.smtpServerHost,
                        smtpPort: provider.smtpPort,
                        fromAddress: provider.fromAddress,
                        userName: provider.userName,
                        password: provider.password,
                        authType: provider.authType as AuthenticationType,
                        // Get properties from the properties array
                        displayName: provider.properties?.find(
                            (p: any) => p.key === EmailProviderConstants.SIGNATURE_KEY
                        )?.value,
                        replyToAddress: provider.properties?.find(
                            (p: any) => p.key === EmailProviderConstants.REPLY_TO_ADDRESS_KEY
                        )?.value
                    };

                    setEmailProviderSettings({
                        providerParams: {
                            ...defaultProviderParams,
                            [EmailProviderConstants.SMTP_EMAIL_PROVIDER]: smtpProvider
                        },
                        selectedProvider: EmailProviderConstants.SMTP_EMAIL_PROVIDER
                    });
                }
                // Add logic for Custom provider detection if needed in the future
            }

            setExistingEmailProviders(existingProviderNames);
            setIsLoading(false);
        }
    }, [ isEmailProviderConfigFetchRequestLoading, originalEmailProviderConfig ]);

    const handleProviderChange = (selectedProvider: string) => {
        setEmailProviderSettings({ ...emailProviderSettings, selectedProvider });
    };

    const handleAuthenticationChange = (): void => {
        setIsAuthenticationUpdateFormState(true);
        const currentProvider: EmailProviderInterface =
            emailProviderSettings.providerParams[emailProviderSettings.selectedProvider];

        if (currentProvider?.authType) {
            setEndpointAuthType(currentProvider.authType);

            if (formStateRef.current) {
                formStateRef.current.change("authType", currentProvider.authType);

                if (currentProvider.authType === AuthenticationType.BASIC) {
                    formStateRef.current.change("userName", currentProvider.userName);
                    formStateRef.current.change("password", null);
                } else if (currentProvider.authType === AuthenticationType.CLIENT_CREDENTIAL) {
                    formStateRef.current.change("clientId", currentProvider.clientId);
                    formStateRef.current.change("tokenEndpoint", currentProvider.tokenEndpoint);
                    formStateRef.current.change("scopes", currentProvider.scopes);
                    formStateRef.current.change("clientSecret", null);
                }
            }
        }
    };

    const handleSubmit = async (values: EmailProviderInterface) => {
        setIsSubmitting(true);
        const { selectedProvider } = emailProviderSettings;

        try {
            let updateData: any;

            if (selectedProvider === EmailProviderConstants.SMTP_EMAIL_PROVIDER) {
                // Handle SMTP provider data
                updateData = {
                    name: EmailProviderConstants.EMAIL_PROVIDER_CONFIG_NAME,
                    smtpServerHost: values.smtpServerHost,
                    smtpPort: values.smtpPort,
                    fromAddress: values.fromAddress,
                    userName: values.userName,
                    password: values.password,
                    authType: values.authType || AuthenticationType.BASIC,
                    properties: []
                };

                if (values.displayName) {
                    updateData.properties.push({
                        key: EmailProviderConstants.SIGNATURE_KEY,
                        value: values.displayName
                    });
                }

                if (values.replyToAddress) {
                    updateData.properties.push({
                        key: EmailProviderConstants.REPLY_TO_ADDRESS_KEY,
                        value: values.replyToAddress
                    });
                }
            } else {
                // Handle Custom provider data
                updateData = {
                    name: EmailProviderConstants.EMAIL_PROVIDER_CONFIG_NAME,
                    properties: [
                        { key: "providerURL", value: values.providerURL },
                        { key: "contentType", value: values.contentType },
                        { key: "httpMethod", value: values.httpMethod },
                        { key: "payload", value: values.payload }
                    ]
                };

                // Add authentication properties for custom provider
                if (values.authType) {
                    updateData.authType = values.authType;
                    
                    if (values.authType === AuthenticationType.BASIC) {
                        updateData.properties.push(
                            { key: EmailProviderConstants.USERNAME, value: values.userName },
                            { key: EmailProviderConstants.PASSWORD, value: values.password }
                        );
                    } else if (values.authType === AuthenticationType.CLIENT_CREDENTIAL) {
                        updateData.properties.push(
                            { key: EmailProviderConstants.CLIENT_ID, value: values.clientId },
                            { key: EmailProviderConstants.CLIENT_SECRET, value: values.clientSecret },
                            { key: EmailProviderConstants.TOKEN_ENDPOINT, value: values.tokenEndpoint }
                        );
                        
                        if (values.scopes) {
                            updateData.properties.push({ key: EmailProviderConstants.SCOPES, value: values.scopes });
                        }
                    }
                }
            }

            await updateEmailProviderConfigurations(updateData, false);
            
            handleUpdateSuccess();
            mutateEmailProviderConfig();
            setIsAuthenticationUpdateFormState(false);
        } catch (error) {
            handleUpdateError(error as IdentityAppsApiException);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateSuccess = () => {
        dispatch(
            addAlert({
                description: t("emailProviders:notifications.updateConfiguration.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("emailProviders:notifications.updateConfiguration.success.message")
            })
        );
    };

    const handleUpdateError = (_error: IdentityAppsApiException) => {
        dispatch(
            addAlert({
                description: t("emailProviders:notifications.updateConfiguration.error.description"),
                level: AlertLevels.ERROR,
                message: t("emailProviders:notifications.updateConfiguration.error.message")
            })
        );
    };

    const handleConfigurationDelete = async (): Promise<boolean> => {
        setIsDeleting(true);

        try {
            await deleteEmailProviderConfigurations(false);
            
            dispatch(
                addAlert({
                    description: t("emailProviders:notifications.deleteConfiguration.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("emailProviders:notifications.deleteConfiguration.success.message")
                })
            );
            
            setEmailProviderSettings({
                providerParams: defaultProviderParams,
                selectedProvider: EmailProviderConstants.SMTP_EMAIL_PROVIDER
            });
            
            mutateEmailProviderConfig();
            return true;
        } catch (error) {
            dispatch(
                addAlert({
                    description: t("emailProviders:notifications.deleteConfiguration.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("emailProviders:notifications.deleteConfiguration.error.message")
                })
            );
            return false;
        } finally {
            setIsDeleting(false);
        }
    };

    const validateForm = (values: EmailProviderInterface) => {
        const error: any = {};
        const { selectedProvider } = emailProviderSettings;

        if (selectedProvider === EmailProviderConstants.SMTP_EMAIL_PROVIDER) {
            if (!values?.smtpServerHost) {
                error.smtpServerHost = t("emailProviders:form.smtp.validations.required");
            }
            if (!values?.smtpPort) {
                error.smtpPort = t("emailProviders:form.smtp.validations.required");
            }
            if (!values?.fromAddress) {
                error.fromAddress = t("emailProviders:form.smtp.validations.required");
            }
            if (!values?.userName) {
                error.userName = t("emailProviders:form.smtp.validations.required");
            }
            if (!values?.password) {
                error.password = t("emailProviders:form.smtp.validations.required");
            }
        } else if (selectedProvider === EmailProviderConstants.CUSTOM_EMAIL_PROVIDER) {
            if (!values?.providerURL) {
                error.providerURL = t("emailProviders:form.custom.validations.required");
            }
            if (!values?.contentType) {
                error.contentType = t("emailProviders:form.custom.validations.required");
            }
            if (!values?.httpMethod) {
                error.httpMethod = t("emailProviders:form.custom.validations.required");
            }
            if (!values?.payload) {
                error.payload = t("emailProviders:form.custom.validations.required");
            }

            // Validate authentication fields for custom provider
            const hasExistingConfig: boolean = existingEmailProviders.includes(EmailProviderConstants.CUSTOM_EMAIL_PROVIDER);
            const requireSecrets: boolean = !hasExistingConfig || isAuthenticationUpdateFormState;

            if (values?.authType === AuthenticationType.BASIC) {
                if (!values?.userName) {
                    error.userName = t("emailProviders:form.custom.validations.required");
                }
                if (!values?.password && requireSecrets) {
                    error.password = t("emailProviders:form.custom.validations.required");
                }
            } else if (values?.authType === AuthenticationType.CLIENT_CREDENTIAL) {
                if (!values?.clientId) {
                    error.clientId = t("emailProviders:form.custom.validations.required");
                }
                if (!values?.clientSecret && requireSecrets) {
                    error.clientSecret = t("emailProviders:form.custom.validations.required");
                }
                if (!values?.tokenEndpoint) {
                    error.tokenEndpoint = t("emailProviders:form.custom.validations.required");
                }
            }
        }

        return error;
    };

    return (
        <PageLayout
            title={ t("emailProviders:heading") }
            pageTitle={ t("emailProviders:heading") }
            description={ t("emailProviders:subHeading") }
            bottomMargin={ false }
            contentTopMargin={ false }
            pageHeaderMaxWidth={ true }
            data-componentid={ `${componentId}-form-layout` }
        >
            { isEmailProviderConfigFetchRequestLoading || isDeleting || isLoading ? (
                <div data-componentid={ `${componentId}-form-loading` }>
                    {
                        [ ...Array(3) ].map((key: number) => {
                            return (
                                <Placeholder key={ key }>
                                    <Placeholder.Line length="very short" />
                                    <div>
                                        <Placeholder.Line length="long" />
                                        <Placeholder.Line length="medium" />
                                    </div>
                                </Placeholder>
                            );
                        })
                    }
                </div>
            ) : (
                <Grid className={ "mt-2" }>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column>
                            <FinalForm
                                onSubmit={ handleSubmit }
                                validate={ validateForm }
                                initialValues={
                                    emailProviderSettings?.selectedProvider
                                        ? emailProviderSettings?.providerParams[emailProviderSettings?.selectedProvider]
                                        : {}
                                }
                                render={ ({ handleSubmit, form }: FormRenderProps) => {
                                    formStateRef.current = form;

                                    return (
                                        <form className="email-provider-config-form" onSubmit={ handleSubmit } noValidate>
                                            <div className="card-list">
                                                <Grid>
                                                    <Grid.Row columns={ 3 }>
                                                        { providerCards.map(
                                                            (provider: EmailProviderCardInterface) => {
                                                                const emailProviderName: string =
                                                                    provider?.name?.toLocaleLowerCase();

                                                                return (<Grid.Column key={ provider?.id }>
                                                                    <InfoCard
                                                                        fluid
                                                                        data-componentid={
                                                                            `${emailProviderName}-email-provider-info-card`
                                                                        }
                                                                        image={ provider.icon }
                                                                        imageSize="x30"
                                                                        header={ provider.name }
                                                                        className={
                                                                            emailProviderSettings?.selectedProvider ===
                                                                            provider?.key
                                                                                ? "email-provider-info-card selected"
                                                                                : "email-provider-info-card"
                                                                        }
                                                                        key={ provider.id }
                                                                        onClick={ () =>
                                                                            handleProviderChange(provider?.key)
                                                                        }
                                                                        showSetupGuideButton={ false }
                                                                        showCardAction={ false }
                                                                    />
                                                                </Grid.Column>);
                                                            })
                                                        }
                                                    </Grid.Row>
                                                </Grid>
                                            </div>

                                            { emailProviderSettings?.selectedProvider ===
                                                            EmailProviderConstants.SMTP_EMAIL_PROVIDER && (
                                                <SMTPEmailProvider
                                                    isLoading={ isSubmitting }
                                                    isReadOnly={ !hasEmailProviderUpdatePermissions }
                                                    onSubmit={ handleSubmit }
                                                    data-componentid={ "smtp-email-provider" }
                                                />
                                            ) }
                                            
                                            { emailProviderSettings?.selectedProvider ===
                                                            EmailProviderConstants.CUSTOM_EMAIL_PROVIDER && (
                                                <CustomEmailProvider
                                                    isLoading={ isSubmitting }
                                                    isReadOnly={ !hasEmailProviderUpdatePermissions }
                                                    onSubmit={ handleSubmit }
                                                    data-componentid={ "custom-email-provider" }
                                                    hasExistingConfig={
                                                        existingEmailProviders.includes(EmailProviderConstants.CUSTOM_EMAIL_PROVIDER)
                                                    }
                                                    currentAuthType={
                                                        emailProviderSettings?.providerParams[
                                                            EmailProviderConstants.CUSTOM_EMAIL_PROVIDER
                                                        ]?.authType
                                                    }
                                                    endpointAuthType={ endpointAuthType }
                                                    setEndpointAuthType={ setEndpointAuthType }
                                                    isAuthenticationUpdateFormState={ isAuthenticationUpdateFormState }
                                                    setIsAuthenticationUpdateFormState={ setIsAuthenticationUpdateFormState }
                                                    formState={ formStateRef }
                                                    onAuthenticationChange={ handleAuthenticationChange }
                                                />
                                            ) }
                                        </form>
                                    );
                                } }
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            ) }
            
            {
                !isLoading && !isEmailProviderConfigFetchRequestLoading && (
                    <Show when={ featureConfig?.emailProviders?.scopes?.delete }>
                        <DangerZoneGroup
                            sectionHeader={ t("emailProviders:dangerZoneGroup.header") }
                        >
                            <DangerZone
                                data-componentid={ `${componentId}-revert-email-provider-config` }
                                actionTitle={ t("emailProviders:dangerZoneGroup.revertConfig.actionTitle") }
                                header={ t("emailProviders:dangerZoneGroup.revertConfig.heading") }
                                subheader={ t("emailProviders:dangerZoneGroup.revertConfig.subHeading") }
                                onActionClick={ (): void => {
                                    setOpenRevertConfigModal(true);
                                } }
                            />
                        </DangerZoneGroup>
                        <ConfirmationModal
                            primaryActionLoading={ isSubmitting }
                            data-componentid={ `${ componentId}-revert-confirmation-modal` }
                            onClose={ (): void => setOpenRevertConfigModal(false) }
                            type="negative"
                            open={ isOpenRevertConfigModal }
                            assertionHint={ t("emailProviders:confirmationModal.assertionHint") }
                            assertionType="checkbox"
                            primaryAction={ t("common:confirm") }
                            secondaryAction={ t("common:cancel") }
                            onSecondaryActionClick={ (): void => setOpenRevertConfigModal(false) }
                            onPrimaryActionClick={ (): void => {
                                setIsSubmitting(true);
                                handleConfigurationDelete().finally(() => {
                                    setIsSubmitting(false);
                                    setOpenRevertConfigModal(false);
                                    setExistingEmailProviders([]);
                                });
                            } }
                            closeOnDimmerClick={ false }
                        >
                            <ConfirmationModal.Header
                                data-componentid={ `${componentId}-revert-confirmation-modal-header` }
                            >
                                { t("emailProviders:confirmationModal.header") }
                            </ConfirmationModal.Header>
                            <ConfirmationModal.Message
                                data-componentid={ `${componentId}revert-confirmation-modal-message` }
                                attached
                                negative
                            >
                                { t("emailProviders:confirmationModal.message") }
                            </ConfirmationModal.Message>
                            <ConfirmationModal.Content>
                                { t("emailProviders:confirmationModal.content") }
                            </ConfirmationModal.Content>
                        </ConfirmationModal>
                    </Show>
                ) }
        </PageLayout>
    );
};

MultiProviderEmailProvidersPage.defaultProps = {
    "data-componentid": "multi-provider-email-providers-page"
};

export default MultiProviderEmailProvidersPage;
