/**
 * Custom Email Provider Demo
 * 
 * This demonstrates how to use the custom email provider page that was created
 * similar to the SMS providers structure.
 * 
 * Usage:
 * 1. Import the MultiProviderEmailProvidersPage from the public API
 * 2. Use it in your routing or as a replacement for the existing EmailProvidersPage
 * 3. The component supports both SMTP and Custom email providers
 * 
 * Features:
 * - Provider selection with InfoCards (SMTP and Custom)
 * - Custom provider supports external API authentication (Basic, Client Credential)
 * - SMTP provider maintains compatibility with existing email provider configuration
 * - Form validation for both provider types
 * - Proper error handling and success notifications
 * 
 * Files created:
 * - pages/custom-email-provider.tsx - Custom email provider component with API authentication
 * - pages/smtp-email-provider.tsx - SMTP provider component (extracted from original)
 * - pages/multi-provider-email-providers.tsx - Main page with provider selection
 * - pages/email-providers.scss - Updated styles for both providers
 * - configs/provider-cards.ts - Provider card configuration
 * - configs/ui.ts - Icon configuration for providers
 * - models/email-providers.ts - Updated with new interfaces
 * - constants/email-provider-constants.ts - Updated with provider constants
 * 
 * Example integration:
 * 
 * ```tsx
 * import { MultiProviderEmailProvidersPage } from "@wso2is/admin.email-providers.v1";
 * 
 * // Use in your router
 * <Route 
 *   path="/email-providers" 
 *   component={MultiProviderEmailProvidersPage} 
 * />
 * ```
 * 
 * The custom email provider supports:
 * - Custom API endpoint URL
 * - Content-Type specification
 * - HTTP method selection (GET, POST, PUT)
 * - Request payload configuration
 * - External API authentication:
 *   - Basic Authentication (username/password)
 *   - OAuth2 Client Credentials (clientId/clientSecret/tokenEndpoint/scopes)
 * 
 * Authentication fields are properly handled with:
 * - Password masking with show/hide toggle
 * - Validation for required fields
 * - Support for existing configurations (passwords not required when editing)
 * - Proper form state management
 */

// Example of how the custom email provider configuration might look:
const customEmailProviderExample = {
    providerURL: "https://api.example.com/send-email",
    contentType: "application/json",
    httpMethod: "POST",
    payload: JSON.stringify({
        to: "{{recipient}}",
        subject: "{{subject}}",
        body: "{{body}}",
        from: "noreply@example.com"
    }),
    authType: "CLIENT_CREDENTIAL",
    clientId: "your-client-id",
    clientSecret: "your-client-secret",
    tokenEndpoint: "https://auth.example.com/oauth/token",
    scopes: "email:send"
};

export { customEmailProviderExample };