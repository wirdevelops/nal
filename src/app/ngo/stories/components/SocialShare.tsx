'use client';

import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon
} from 'react-share';

interface SocialShareProps {
  url: string;
  title: string;
  className?: string;
}

export const SocialShare = ({ url, title, className }: SocialShareProps) => (
  <div className={`flex gap-2 ${className || ''}`}>
    <WhatsappShareButton url={url} title={title}>
      <WhatsappIcon size={32} round />
    </WhatsappShareButton>
    <FacebookShareButton url={url} hashtag="#impactstories">
      <FacebookIcon size={32} round />
    </FacebookShareButton>
    <TwitterShareButton url={url} title={title}>
      <TwitterIcon size={32} round />
    </TwitterShareButton>
    <LinkedinShareButton 
      url={url} 
      title={title}
      source="Our NGO"
    >
      <LinkedinIcon size={32} round />
    </LinkedinShareButton>
  </div>
);