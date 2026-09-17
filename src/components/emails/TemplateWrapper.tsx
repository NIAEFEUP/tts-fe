import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';

interface TemplateWrapperProps {
  previewText: string;
  subject?: string;
  bodyHtml?: string; // The dynamically generated HTML body
  children?: React.ReactNode; // Alternative for static previews
  isPreview?: boolean;
}

export const TemplateWrapper = ({
  previewText,
  bodyHtml,
  children,
  isPreview = false,
}: TemplateWrapperProps) => {
  const content = (
    <Tailwind>
      <Container className={`mx-auto max-w-[600px] ${isPreview ? 'p-[20px]' : 'border border-solid border-[#eaeaea] rounded my-[40px] p-[20px] bg-white shadow-sm'}`}>
        
        {/* Header Section */}
        <Section className="mt-[32px]">
          <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
            <span className="font-bold tracking-tight text-blue-600">NIAEFEUP</span>
          </Heading>
        </Section>
        
        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
        
        {/* Dynamic Content Section */}
        <Section className="mb-[32px]">
          {bodyHtml ? (
            <div dangerouslySetInnerHTML={{ __html: bodyHtml }} className="text-gray-700 text-[14px] leading-[24px]" />
          ) : (
            <div className="text-gray-700 text-[14px] leading-[24px]">
              {children}
            </div>
          )}
        </Section>
        
        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
        
        {/* Footer Section */}
        <Section>
          <Text className="text-[#666666] text-[12px] leading-[24px] text-center">
            This email was intended for you. If you were not expecting this email, you can ignore this email.
            <br />
            © {new Date().getFullYear()} NIAEFEUP. All rights reserved.
          </Text>
        </Section>
        
      </Container>
    </Tailwind>
  );

  if (isPreview) {
    return (
      <div className="font-sans w-full">
        {content}
      </div>
    );
  }

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body className="bg-gray-100 my-auto mx-auto font-sans px-2">
        {content}
      </Body>
    </Html>
  );
};

export default TemplateWrapper;
