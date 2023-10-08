import Image from 'next/image';
import Link from 'next/link';

function Logo({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  return (
    <div className={`text-1xl ${theme == 'light' ? 'text-white' : 'text-redpraha'}`}>
      <strong className='-ml-2 sm:ml-0 logo'>GreatGrants</strong>
      
    </div>
  );
}

export default Logo;
