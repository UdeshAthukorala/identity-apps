/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { EmptyPlaceholder, Heading, LabeledCard } from "@wso2is/react-components";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement } from "react";
import { Droppable, DroppableProvided } from "react-beautiful-dnd";
import { Icon } from "semantic-ui-react";
import { AuthenticationStepInterface, AuthenticatorInterface } from "../../../../models";
import { AuthenticatorListItemInterface } from "../../meta";

/**
 * Proptypes for the authentication step component.
 */
interface AuthenticationStepPropsInterface {
    /**
     * List of all available authenticators.
     */
    authenticators: AuthenticatorListItemInterface[];
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * ID for the dropable field.
     */
    droppableId: string;
    /**
     * Callback for the step delete.
     */
    onStepDelete: (stepIndex: number) => void;
    /**
     * Callback for the step option delete.
     */
    onStepOptionDelete: (stepIndex: number, optionIndex: number) => void;
    /**
     * Current step.
     */
    step: AuthenticationStepInterface;
    /**
     * Index of the current step.
     */
    stepIndex: number;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
}

/**
 * Component to render the authentication step.
 *
 * @param {AuthenticationStepPropsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const AuthenticationStep: FunctionComponent<AuthenticationStepPropsInterface> = (
    props: AuthenticationStepPropsInterface
): ReactElement => {

    const {
        authenticators,
        className,
        droppableId,
        onStepDelete,
        onStepOptionDelete,
        readOnly,
        step,
        stepIndex
    } = props;

    const classes = classNames("authentication-step-container", className);

    /**
     * Resolves the authenticator step option.
     *
     * @param {AuthenticatorInterface} option - Authenticator step option.
     * @param {number} stepIndex - Index of the step.
     * @param {number} optionIndex - Index of the option.
     * @return {ReactElement}
     */
    const resolveStepOption = (option: AuthenticatorInterface, stepIndex: number,
                               optionIndex: number): ReactElement => {

        if (authenticators && authenticators instanceof Array && authenticators.length > 0) {

            const authenticator = authenticators.find((item) => item.authenticator === option.authenticator);

            if (!authenticator) {
                return null;
            }

            return (
                <LabeledCard
                    image={ authenticator.image }
                    label={ authenticator.displayName }
                    bottomMargin={ false }
                    onCloseClick={
                        !readOnly && (
                            (): void => onStepOptionDelete(stepIndex, optionIndex)
                        )
                    }
                />
            );
        }
    };

    return (
        <Droppable
            droppableId={ droppableId }
            isDropDisabled={ readOnly }
        >
            { (provided: DroppableProvided): React.ReactElement<HTMLElement> => (
                <div
                    ref={ provided.innerRef }
                    { ...provided.droppableProps }
                    className={ classes }
                >
                    <Heading className="step-header" as="h6">Step { step.id }</Heading>
                    <Icon className="delete-button" name="cancel" onClick={ (): void => onStepDelete(stepIndex) }/>
                    <div className="authentication-step">
                        {
                            (step.options && step.options instanceof Array && step.options.length > 0)
                                ? step.options.map((option, optionIndex) =>
                                    resolveStepOption(option, stepIndex, optionIndex))
                                : (
                                    <EmptyPlaceholder
                                        subtitle={ [ "Drag and drop any of the above authenticators",
                                            "to build an authentication sequence." ]
                                        }/>
                                )
                        }
                        { provided.placeholder }
                    </div>
                </div>
            ) }
        </Droppable>
    );
};
