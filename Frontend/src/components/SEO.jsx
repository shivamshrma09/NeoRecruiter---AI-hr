const SEO = ({ 
  title = "NeoRecruiter - AI-Powered Interview Platform"
}) => {
  if (typeof document !== 'undefined') {
    document.title = title;
  }
  return null;
};

export default SEO;