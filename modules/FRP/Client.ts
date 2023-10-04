/** FRP 客户端配置 */
export interface FRPClientInitLocalConfig {
  local_port: string;
  custom_domains: string;
}

/** FRP 客户端配置 */
export interface FRPClientInitConfig {
  common: {
    server_addr: string;
    server_port: string;
  };

  vhost_http_port: string;

  localConfigs: FRPClientInitLocalConfig[];
}
