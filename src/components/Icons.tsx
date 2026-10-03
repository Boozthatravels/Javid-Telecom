import React from 'react';
import {
  Smartphone,
  Headphones,
  BatteryCharging,
  Watch,
  Zap,
  Cable,
  Shield,
  Layers,
  Speaker,
  HardDrive,
  Usb,
  Battery,
  Cpu,
  Monitor,
  Volume2,
  Mic,
  Camera,
  Unlock,
  Sparkles,
  Wrench,
  Laptop,
  Download,
  ShieldCheck,
  Keyboard,
  Printer,
  Copy,
  Palette,
  Image as ImageIcon,
  CreditCard,
  Scan,
  FileText,
  FileCheck,
  GraduationCap,
  Briefcase,
  Globe,
  Award,
  UploadCloud,
} from 'lucide-react';

export const BrandLogo: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <svg
    viewBox="0 0 44 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect width="44" height="44" rx="10" fill="#0F172A" />
    <rect x="2" y="2" width="40" height="40" rx="8" stroke="#1E40AF" strokeWidth="1.5" />
    {/* Smartphone silhouette */}
    <rect x="11" y="9" width="14" height="26" rx="3" fill="#1D4ED8" stroke="#93C5FD" strokeWidth="1.5" />
    <circle cx="18" cy="31.5" r="1" fill="#EFF6FF" />
    {/* Digital document / printing page overlapping */}
    <path
      d="M22 14H31C32.1046 14 33 14.8954 33 16V30C33 31.1046 32.1046 32 31 32H22V14Z"
      fill="#0284C7"
    />
    <path d="M24.5 19H30.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M24.5 23H30.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M24.5 27H28.5" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const DynamicIcon: React.FC<{ name: string; className?: string }> = ({
  name,
  className = 'w-5 h-5',
}) => {
  switch (name) {
    case 'smartphone':
      return <Smartphone className={className} />;
    case 'headphones':
      return <Headphones className={className} />;
    case 'battery-charging':
      return <BatteryCharging className={className} />;
    case 'watch':
      return <Watch className={className} />;
    case 'zap':
      return <Zap className={className} />;
    case 'cable':
      return <Cable className={className} />;
    case 'shield':
      return <Shield className={className} />;
    case 'layers':
      return <Layers className={className} />;
    case 'speaker':
      return <Speaker className={className} />;
    case 'hard-drive':
      return <HardDrive className={className} />;
    case 'usb':
      return <Usb className={className} />;
    case 'battery':
      return <Battery className={className} />;
    case 'cpu':
      return <Cpu className={className} />;
    case 'monitor':
      return <Monitor className={className} />;
    case 'volume-2':
      return <Volume2 className={className} />;
    case 'mic':
      return <Mic className={className} />;
    case 'camera':
      return <Camera className={className} />;
    case 'unlock':
      return <Unlock className={className} />;
    case 'sparkles':
      return <Sparkles className={className} />;
    case 'wrench':
      return <Wrench className={className} />;
    case 'laptop':
      return <Laptop className={className} />;
    case 'download':
      return <Download className={className} />;
    case 'shield-check':
      return <ShieldCheck className={className} />;
    case 'keyboard':
      return <Keyboard className={className} />;
    case 'printer':
      return <Printer className={className} />;
    case 'copy':
      return <Copy className={className} />;
    case 'palette':
      return <Palette className={className} />;
    case 'image':
      return <ImageIcon className={className} />;
    case 'credit-card':
      return <CreditCard className={className} />;
    case 'scan':
      return <Scan className={className} />;
    case 'file-text':
      return <FileText className={className} />;
    case 'file-check':
      return <FileCheck className={className} />;
    case 'graduation-cap':
      return <GraduationCap className={className} />;
    case 'briefcase':
      return <Briefcase className={className} />;
    case 'globe':
      return <Globe className={className} />;
    case 'award':
      return <Award className={className} />;
    case 'upload-cloud':
      return <UploadCloud className={className} />;
    default:
      return <Smartphone className={className} />;
  }
};
