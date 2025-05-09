import versionInfo from '../version';

const VersionFooter = () => {
  const { version, buildNumber, buildDate, fullVersion, environment, commitHash } = versionInfo;
  
  return (
    <div className="text-xs text-gray-400 text-center mt-4">
      <span className="mr-2" title={`Full version: ${fullVersion}`}>Version {version} (build {buildNumber})</span>
      <span className="mr-2">•</span>
      <span>{buildDate}</span>
      {commitHash && (
        <>
          <span className="mr-2 ml-2">•</span>
          <span title="Git commit hash">{commitHash.substring(0, 7)}</span>
        </>
      )}
      {environment === 'development' && (
        <>
          <span className="mr-2 ml-2">•</span>
          <span className="text-yellow-600">Development Mode</span>
        </>
      )}
    </div>
  );
};

export default VersionFooter;