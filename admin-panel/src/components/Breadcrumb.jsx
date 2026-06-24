import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = ({ societyName }) => {
  return (
    <section className="society-breadcrumbs" aria-label="Breadcrumb">
      <div className="container">
        <Link to="/">Home</Link>
        <ChevronRight size={14} style={{ opacity: 0.6 }} />
        <span>ExeComm</span>
        <ChevronRight size={14} style={{ opacity: 0.6 }} />
        <span className="active">{societyName}</span>
      </div>
    </section>
  );
};

export default Breadcrumb;
