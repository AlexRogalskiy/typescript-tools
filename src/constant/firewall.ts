export type AuthorizedIp = string;

export interface FirewallConfig {
    ui: AuthorizedIp[];
    api: AuthorizedIp[];
}

export const getFirewallConfig = ({
                                      ui,
                                      api
                                  }: Partial<FirewallConfig>): FirewallConfig => {
    return {
        ui: ui || ["0.0.0.0/0"],
        api: api || []
    };
};
