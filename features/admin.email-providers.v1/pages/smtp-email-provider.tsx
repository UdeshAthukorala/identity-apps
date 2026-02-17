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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { FinalFormField, TextFieldAdapter } from "@wso2is/form";
import {
    Code,
    EmphasizedSegment,
    Hint,
    PrimaryButton
} from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, { FunctionComponent, ReactElement } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Divider, Grid } from "semantic-ui-react";
import { EmailProviderConstants } from "../constants/email-provider-constants";
import "./email-providers.scss";

interface SMTPEmailProviderPageInterface extends IdentifiableComponentInterface {
    isLoading?: boolean;
    isReadOnly: boolean;
    "data-componentid": string;
    onSubmit: (values: any) => void;
}

const SMTPEmailProvider: FunctionComponent<SMTPEmailProviderPageInterface> = (
    props: SMTPEmailProviderPageInterface
): ReactElement => {

    const {
        ["data-componentid"]: componentId,
        isLoading,
        isReadOnly,
        onSubmit
    } = props;

    const { t } = useTranslation();

    return (
        <EmphasizedSegment
            padded={ "very" }
            data-componentid={ `${componentId}-tab` }
        >
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column>
                        <h2>{ t("emailProviders:form.smtp.subHeading") }</h2>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 2 }>
                    <Grid.Column>
                        <FinalFormField
                            key="smtpServerHost"
                            fullWidth
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            ariaLabel="smtpServerHost"
                            readOnly={ isReadOnly }
                            required={ true }
                            data-componentid={ `${componentId}-smtpServerHost` }
                            name="smtpServerHost"
                            type="text"
                            label={ t("emailProviders:form.smtp.smtpServerHost.label") }
                            placeholder={ t("emailProviders:form.smtp.smtpServerHost.placeholder") }
                            helperText={ (
                                <Trans
                                    i18nKey={
                                        "emailProviders:form.smtp.smtpServerHost.hint"
                                    }
                                >
                                    The Server Host usually begins with
                                    <Code>smtp</Code>, followed by the domain
                                    name of the email service provider.
                                </Trans>
                            ) }
                            component={ TextFieldAdapter }
                            maxLength={ EmailProviderConstants.EMAIL_PROVIDER_CONFIG_FIELD_MAX_LENGTH }
                            minLength={ EmailProviderConstants.EMAIL_PROVIDER_CONFIG_FIELD_MIN_LENGTH }
                            autoComplete="new-password"
                        />
                    </Grid.Column>
                    <Grid.Column>
                        <FinalFormField
                            key="smtpPort"
                            fullWidth
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            ariaLabel="smtpPort"
                            readOnly={ isReadOnly }
                            required={ true }
                            data-componentid={ `${componentId}-smtpPort` }
                            name="smtpPort"
                            type="number"
                            label={ t("emailProviders:form.smtp.smtpPort.label") }
                            placeholder={ t("emailProviders:form.smtp.smtpPort.placeholder") }
                            helperText={ (
                                <Trans
                                    i18nKey={
                                        "emailProviders:form.smtp.smtpPort.hint"
                                    }
                                >
                                    For security reasons, we currently support
                                    port <Code>587</Code> only.
                                </Trans>
                            ) }
                            component={ TextFieldAdapter }
                            maxLength={ EmailProviderConstants.EMAIL_PROVIDER_SERVER_PORT_MAX_LENGTH }
                            minLength={ EmailProviderConstants.EMAIL_PROVIDER_CONFIG_FIELD_MIN_LENGTH }
                            autoComplete="new-password"
                            validate={ (value: string) => {
                                if (!value) {
                                    return t("emailProviders:form.smtp.validations.required");
                                }
                                // Custom SMTP port validation (587 only)
                                const port: number = parseInt(value, 10);

                                if (port !== 587) {
                                    return t("emailProviders:form.smtp.validations.smtpPort");
                                }
                            } }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 2 }>
                    <Grid.Column>
                        <FinalFormField
                            key="fromAddress"
                            fullWidth
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            ariaLabel="fromAddress"
                            readOnly={ isReadOnly }
                            required={ true }
                            data-componentid={ `${componentId}-fromAddress` }
                            name="fromAddress"
                            type="email"
                            label={ t("emailProviders:form.smtp.fromAddress.label") }
                            placeholder={ t("emailProviders:form.smtp.fromAddress.placeholder") }
                            helperText={ (
                                <Hint compact>
                                    { t("emailProviders:form.smtp.fromAddress.hint") }
                                </Hint>
                            ) }
                            component={ TextFieldAdapter }
                            maxLength={ EmailProviderConstants.EMAIL_PROVIDER_CONFIG_FIELD_MAX_LENGTH }
                            minLength={ EmailProviderConstants.EMAIL_PROVIDER_CONFIG_FIELD_MIN_LENGTH }
                            autoComplete="new-password"
                            validate={ (value: string) => {
                                if (!value) {
                                    return t("emailProviders:form.smtp.validations.required");
                                }
                                if (!FormValidation.email(value)) {
                                    return t("emailProviders:form.smtp.validations.email");
                                }
                            } }
                        />
                    </Grid.Column>
                    <Grid.Column>
                        <FinalFormField
                            key="replyToAddress"
                            fullWidth
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            ariaLabel="replyToAddress"
                            readOnly={ isReadOnly }
                            data-componentid={ `${componentId}-replyToAddress` }
                            name="replyToAddress"
                            type="email"
                            label={ t("emailProviders:form.smtp.replyToAddress.label") }
                            placeholder={ t("emailProviders:form.smtp.replyToAddress.placeholder") }
                            helperText={ (
                                <Hint compact>
                                    { t("emailProviders:form.smtp.replyToAddress.hint") }
                                </Hint>
                            ) }
                            component={ TextFieldAdapter }
                            maxLength={ EmailProviderConstants.EMAIL_PROVIDER_CONFIG_FIELD_MAX_LENGTH }
                            minLength={ EmailProviderConstants.EMAIL_PROVIDER_CONFIG_FIELD_MIN_LENGTH }
                            autoComplete="new-password"
                            validate={ (value: string) => {
                                if (value && !FormValidation.email(value)) {
                                    return t("emailProviders:form.smtp.validations.email");
                                }
                            } }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 2 }>
                    <Grid.Column>
                        <FinalFormField
                            key="userName"
                            fullWidth
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            ariaLabel="userName"
                            readOnly={ isReadOnly }
                            required={ true }
                            data-componentid={ `${componentId}-userName` }
                            name="userName"
                            type="text"
                            label={ t("emailProviders:form.smtp.userName.label") }
                            placeholder={ t("emailProviders:form.smtp.userName.placeholder") }
                            helperText={ (
                                <Hint compact>
                                    { t("emailProviders:form.smtp.userName.hint") }
                                </Hint>
                            ) }
                            component={ TextFieldAdapter }
                            maxLength={ EmailProviderConstants.EMAIL_PROVIDER_CONFIG_FIELD_MAX_LENGTH }
                            minLength={ EmailProviderConstants.EMAIL_PROVIDER_CONFIG_FIELD_MIN_LENGTH }
                            autoComplete="new-password"
                        />
                    </Grid.Column>
                    <Grid.Column>
                        <FinalFormField
                            key="password"
                            fullWidth
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            ariaLabel="password"
                            readOnly={ isReadOnly }
                            required={ true }
                            data-componentid={ `${componentId}-password` }
                            name="password"
                            type="password"
                            label={ t("emailProviders:form.smtp.password.label") }
                            placeholder={ t("emailProviders:form.smtp.password.placeholder") }
                            helperText={ (
                                <Hint compact>
                                    { t("emailProviders:form.smtp.password.hint") }
                                </Hint>
                            ) }
                            component={ TextFieldAdapter }
                            maxLength={ EmailProviderConstants.EMAIL_PROVIDER_CONFIG_FIELD_MAX_LENGTH }
                            minLength={ EmailProviderConstants.EMAIL_PROVIDER_CONFIG_FIELD_MIN_LENGTH }
                            autoComplete="new-password"
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column>
                        <FinalFormField
                            key="displayName"
                            fullWidth
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            ariaLabel="displayName"
                            readOnly={ isReadOnly }
                            required={ true }
                            data-componentid={ `${componentId}-displayName` }
                            name="displayName"
                            type="text"
                            label={ t("emailProviders:form.smtp.displayName.label") }
                            placeholder={ t("emailProviders:form.smtp.displayName.placeholder") }
                            helperText={ (
                                <Hint compact>
                                    { t("emailProviders:form.smtp.displayName.hint") }
                                </Hint>
                            ) }
                            component={ TextFieldAdapter }
                            maxLength={ EmailProviderConstants.EMAIL_PROVIDER_CONFIG_FIELD_MAX_LENGTH }
                            minLength={ EmailProviderConstants.EMAIL_PROVIDER_CONFIG_FIELD_MIN_LENGTH }
                            autoComplete="new-password"
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>

            {
                !isReadOnly && (
                    <>
                        <Divider hidden />
                        <Grid>
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                    <PrimaryButton
                                        size="small"
                                        type="button"
                                        onClick={ () => {
                                            onSubmit(null); // Let parent handle form data
                                        } }
                                        ariaLabel="SMTP Email provider form update button"
                                        data-componentid={ `${componentId}-update-button` }
                                        loading={ isLoading }
                                    >
                                        { t("emailProviders:buttons.submit") }
                                    </PrimaryButton>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </>
                )
            }
        </EmphasizedSegment>
    );
};

SMTPEmailProvider.defaultProps = {
    "data-componentid": "smtp-email-provider"
};

export default SMTPEmailProvider;
