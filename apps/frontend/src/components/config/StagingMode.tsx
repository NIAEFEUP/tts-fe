type Props = {
    children: JSX.Element;
  };
  
  const StagingMode = ({ children }: Props) => {
    return import.meta.env.VITE_APP_PROD === '0' || import.meta.env.VITE_APP_STAGING === '1' ? (
      <>{children}</>
    ) : null;
  };
  
  export default StagingMode;
  