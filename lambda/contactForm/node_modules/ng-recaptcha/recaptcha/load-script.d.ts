/// <reference types="grecaptcha" />
declare global {
    interface Window {
        ng2recaptchaloaded: () => void;
    }
}
export declare function loadScript(renderMode: "explicit" | string, onLoaded: (grecaptcha: ReCaptchaV2.ReCaptcha) => void, urlParams: string, url?: string, nonce?: string): void;
