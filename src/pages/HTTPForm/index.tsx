import { FC, useEffect } from 'react';
import * as SC from './styles';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FRPClientInitConfig } from '@/modules/FRP/Client';
import { useForm } from 'react-hook-form';
import { Form, FormDescription, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ipcRenderer } from 'electron';
import { Button } from '@/components/ui/button';
import { useMount, useRequest } from 'ahooks';
import { sleep } from '@/lib/utils';
import { toast } from 'react-toastify';

interface HTTPFormProps {}

const HTTPForm: FC<HTTPFormProps> = () => {
  const navigate = useNavigate();

  const form = useForm<Omit<FRPClientInitConfig, 'localConfigs'>>({
    defaultValues: {
      common: {
        server_addr: '',
        server_port: '',
      },
      vhost_http_port: '',
    },
  });

  useMount(async () => {
    const config: FRPClientInitConfig = await ipcRenderer.invoke('get-frp-client-config');
    form.reset(config);
  });

  const { run: handleSubmit, loading } = useRequest(
    async () => {
      await form.handleSubmit(async (values) => {
        await ipcRenderer.invoke('set-frp-client-config', values);
      })();
      toast('保存成功！');
      await sleep();
    },
    { manual: true }
  );

  return (
    <SC.HTTPFormContainer>
      <SC.HTTPFormHeader>
        <ChevronLeft size={28} className="absolute left-0 not-drag cursor-pointer mr-2" onClick={() => navigate('/')} />
        HTTP 服务器配置
      </SC.HTTPFormHeader>

      <Form {...form}>
        <SC.HTTPFormContent onSubmit={handleSubmit}>
          <FormField
            control={form.control}
            name="common.server_addr"
            rules={{ required: '请输入FRP服务器主机' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>FRP服务器主机</FormLabel>
                <FormDescription>
                  配置好了FRP服务器的IP地址或域名，例如：
                  <code>113.113.113.113</code> 或 <code>frp.example.com</code>
                </FormDescription>
                <FormControl>
                  <Input placeholder="请输入远程主机" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="common.server_port"
            rules={{ required: '请输入FRP服务器端口' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>FRP服务器端口</FormLabel>
                <FormDescription>配置好了FRP服务器的端口，例如：7000</FormDescription>
                <FormControl>
                  <Input placeholder="请输入远程端口" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vhost_http_port"
            render={({ field }) => (
              <FormItem>
                <FormLabel>FRP Web端口</FormLabel>
                <FormDescription>配置好了FRP服务器的Web端口，例如：80</FormDescription>
                <FormControl>
                  <Input placeholder="请输入远程Web端口" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button loading={loading} className="mt-4 w-full" type="submit">
            保存
          </Button>
        </SC.HTTPFormContent>
      </Form>
    </SC.HTTPFormContainer>
  );
};

export default HTTPForm;
