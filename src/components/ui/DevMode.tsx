type Props = {
  children: JSX.Element;
};

const DevMode = ({ children }: Props) => {
  return import.meta.env.VITE_APP_PROD === '0' ? (
    <>{children}</>
  ) : null;
};

export default DevMode;
