export interface SettingPopup {
    recordId?: string;
    type?: 'settings' | 'tags';
    position?: 'top' | 'bottom';
    show?: boolean;
}
