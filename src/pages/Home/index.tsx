import { FC } from 'react';
import * as SC from './styles';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';

interface HomeProps {}

const Home: FC<HomeProps> = () => {
  const navigate = useNavigate();

  return (
    <SC.HomeContainer>
      <SC.HomeHeader>简单、高效的内网穿透工具</SC.HomeHeader>
      <SC.HomeDescription>FRP 支持多种代理类型以及 P2P 通信，为不同场景下的需求提供丰富的解决方案。</SC.HomeDescription>
      <SC.HomeContent className='md:flex-row'>
        <Button onClick={() => navigate('/http-form')}>
          <Rocket size={16} className="mr-1" />
          HTTP 服务器配置
        </Button>
        <Button onClick={() => navigate('/web-form')}>
          <Rocket size={16} className="mr-1" />
          Web 服务器配置
        </Button>
      </SC.HomeContent>
    </SC.HomeContainer>
  );
};

export default Home;
