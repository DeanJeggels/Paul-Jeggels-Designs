import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const NavCard = ({ title, subtitle, icon: Icon, href = "#" }) => {
  return (
    <Link
      to={href}
      className="group relative flex items-center justify-between p-6 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white transition-all duration-300 rounded-sm overflow-hidden"
    >
        {/* Hover accent line */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-pjd-white group-hover:bg-pjd-gold transition-colors duration-300"></div>

        <div className="flex flex-col z-10">
            <h3 className="text-xl font-bold text-white group-hover:text-pjd-blue transition-colors duration-300">{title}</h3>
            <p className="text-sm text-gray-300 group-hover:text-pjd-blue/80 transition-colors duration-300">{subtitle}</p>
        </div>
        
        <div className="z-10 text-white group-hover:text-pjd-blue transition-colors duration-300">
            {Icon && <Icon className="w-6 h-6" />}
        </div>
    </Link>
  );
};

export default NavCard;
