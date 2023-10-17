import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FRPClientInitConfig } from '@/modules/FRP/Client';
import { useRequest } from 'ahooks';
import { ipcRenderer, shell } from 'electron';
import { ChevronLeft, StopCircle, Trash2 } from 'lucide-react';
import { FC, FormEvent, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as SC from './styles';

function useScroll() {
  // for auto-scroll
  const scrollRef = useRef<HTMLFormElement>(null);

  function scrollDomToBottom() {
    const dom = scrollRef.current;
    if (dom) {
      requestAnimationFrame(() => {
        dom.scrollTo(0, dom.scrollHeight);
      });
    }
  }

  function scrollDomToTop() {
    const dom = scrollRef.current;
    if (dom) {
      requestAnimationFrame(() => {
        dom.scrollTo(0, 0);
      });
    }
  }

  return {
    scrollRef,
    scrollDomToTop,
    scrollDomToBottom,
  };
}

const WebForm: FC = () => {
  const form = useForm<FRPClientInitConfig>({
    defaultValues: {
      common: {
        server_addr: '',
        server_port: '',
      },
      vhost_http_port: '',
      localConfigs: [{ local_port: '', custom_domains: '' }],
    },
  });

  const { scrollRef, scrollDomToTop, scrollDomToBottom } = useScroll();
  const [isStart, setIsStart] = useState(false);

  console.log('🍔 - file: index.tsx:58 - isStart ->', isStart);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'localConfigs',
  });

  const { run: handleRunFRPClient, loading } = useRequest(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await form.handleSubmit(async (values) => {
        if (!values.common.server_addr || !values.common.server_port) {
          toast('请先配置FRP服务器设置', {
            type: 'error',
          });
          return;
        }
        await ipcRenderer.invoke('run-frp-client', values);
        setIsStart(true);
        scrollDomToTop();
      })();
    },
    { manual: true }
  );

  const navigate = useNavigate();

  const watchFiles = form.watch(['common.server_addr', 'vhost_http_port', 'localConfigs']);
  const [serverHost, vhostHttpPort, localConfigs] = watchFiles;

  useRequest(async () => {
    const config: FRPClientInitConfig = await ipcRenderer.invoke('get-frp-client-config');
    form.reset(config);
  });

  return (
    <SC.WebFormContainer>
      <SC.WebFormHeader>
        <ChevronLeft size={28} className="absolute left-0 not-drag cursor-pointer mr-2" onClick={() => navigate('/')} />
        Web 服务器配置
      </SC.WebFormHeader>
      {isStart && (
        <>
          <SC.WebFormSubHeader className="not-drag">
            <span>服务运行中...</span>
            <StopCircle
              className="ml-3 mt-[5px] cursor-pointer text-primary/80 not-drag"
              size={17}
              onClick={() => {
                setIsStart(false);
                ipcRenderer.invoke('stop-frp-client');
              }}
            />
          </SC.WebFormSubHeader>
          {localConfigs.map((field, index) => (
            <Button
              variant="link"
              key={index}
              onClick={() => {
                shell.openExternal(`http://${(field.custom_domains ?? serverHost) + ':' + vhostHttpPort}`);
              }}
            >
              Web {index + 1}： http://
              {(field.custom_domains ?? serverHost) + ':' + vhostHttpPort}
            </Button>
          ))}
        </>
      )}

      <Form {...form}>
        <SC.WebFormContent ref={scrollRef} onSubmit={handleRunFRPClient}>
          <div className="space-y-6">
            {fields.map((field, index) => (
              <div className="space-y-2" key={field.id}>
                <FormField
                  control={form.control}
                  name={`localConfigs.${index}.local_port`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        本地Web端口
                        {index > 0 && (
                          <span className="inline-flex">
                            <span className="ml-1">{index + 1}</span>
                            <Trash2
                              className="ml-1 mt-[5px] cursor-pointer text-primary/80"
                              size={17}
                              onClick={() => {
                                remove(index);
                                scrollDomToBottom();
                              }}
                            />
                          </span>
                        )}
                      </FormLabel>
                      <FormDescription>配置好了本地Web服务器的端口，例如：3000</FormDescription>
                      <FormControl>
                        <Input placeholder="请输入本地Web端口" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`localConfigs.${index}.custom_domains`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>自定义域名</FormLabel>
                      <FormDescription>配置好了本地Web服务器的自定义域名，例如：example.com</FormDescription>
                      <FormControl>
                        <Input placeholder="请输入自定义域名" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>

          <SC.WebFormButtonWrapper>
            <Button loading={loading} className="primary" type="submit">
              运行FRP客户端
            </Button>
            <Button
              loading={loading}
              type="button"
              onClick={() => {
                append({ local_port: '', custom_domains: '' });
                scrollDomToBottom();
              }}
            >
              添加更多服务器
            </Button>
          </SC.WebFormButtonWrapper>
        </SC.WebFormContent>
      </Form>
    </SC.WebFormContainer>
  );
};

export default WebForm;
