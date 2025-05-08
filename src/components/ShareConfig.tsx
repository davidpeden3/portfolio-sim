import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { generateShareableUrl, checkAndImportFromUrl } from '../utils/configShare';

interface ShareConfigProps {
  onImportSuccess?: () => void;
  hideButton?: boolean;
}

const ShareConfig: React.FC<ShareConfigProps> = ({ 
  onImportSuccess,
  hideButton = false
}) => {
  const [shareUrl, setShareUrl] = useState<string>('');
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const urlInputRef = useRef<HTMLInputElement>(null);
  
  // Check for URL import on component mount
  useEffect(() => {
    const imported = checkAndImportFromUrl();
    if (imported && onImportSuccess) {
      onImportSuccess();
    }
  }, [onImportSuccess]);

  // Initialize URL if not set
  useEffect(() => {
    if (!shareUrl) {
      setShareUrl(generateShareableUrl());
    }
  }, [shareUrl]);

  // Copy URL to clipboard
  const copyUrlToClipboard = () => {
    if (urlInputRef.current) {
      urlInputRef.current.select();
      document.execCommand('copy');
      
      // Show copied message
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* URL input and Copy button */}
      <div className="flex space-x-2">
        <input
          ref={urlInputRef}
          type="text"
          className="flex-1 p-2 border border-gray-300 dark:border-darkBlue-600 dark:bg-darkBlue-800 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-basshead-blue-500 dark:focus:border-basshead-blue-500 text-gray-900 dark:text-white transition-colors duration-200"
          readOnly
          value={shareUrl}
        />
        <button
          onClick={copyUrlToClipboard}
          className="px-4 py-2 bg-indigo-600 dark:bg-basshead-blue-600 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-basshead-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-basshead-blue-500 transition-colors duration-200"
        >
          Copy
        </button>
      </div>
      
      {/* Copied notification */}
      {showCopiedMessage && (
        <div className="text-sm text-green-600 dark:text-green-400 mt-2">
          Link copied to clipboard!
        </div>
      )}
      
      {/* QR Code */}
      <div className="border-t border-gray-200 dark:border-darkBlue-700 pt-6 transition-colors duration-200">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 transition-colors duration-200">
          Or scan this QR code
        </h3>
        
        <div className="flex justify-center">
          <div className="bg-white p-4 rounded-lg border border-gray-200 dark:border-gray-700 inline-block">
            <QRCodeSVG 
              value={shareUrl} 
              size={200}
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"M"}
              includeMargin={false}
            />
            <div className="mt-2 text-sm text-center text-gray-600 dark:text-gray-300">
              Scan with your mobile device
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareConfig;