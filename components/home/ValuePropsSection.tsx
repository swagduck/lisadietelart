import React from 'react';
import { IValueProp } from '@/types/artwork';
import { ShieldCheck, Truck, Sparkles } from 'lucide-react';

interface ValuePropsSectionProps {
  props: IValueProp[];
}

export function ValuePropsSection({ props }: ValuePropsSectionProps) {
  const icons = [
    <ShieldCheck key="icon-0" className="h-5 w-5 text-sage" strokeWidth={1.5} />,
    <Truck key="icon-1" className="h-5 w-5 text-sage" strokeWidth={1.5} />,
    <Sparkles key="icon-2" className="h-5 w-5 text-sage" strokeWidth={1.5} />,
  ];

  return (
    <section
      className="border-b border-line bg-mist/15 px-6 py-20 md:px-12"
      aria-labelledby="value-props-title"
    >
      <div className="mx-auto max-w-7xl">
        <h2 id="value-props-title" className="sr-only">
          Studio standards and guarantees
        </h2>

        {/* 3 Value Props Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {props.map((prop, idx) => (
            <div
              key={prop.id}
              className="space-y-3 border border-line bg-paper p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-mist/60">
                {icons[idx % icons.length]}
              </div>

              {prop.badge && (
                <span className="block text-xs font-normal text-sage">
                  {prop.badge}
                </span>
              )}

              <h3 className="font-heading text-2xl font-normal text-ink">{prop.title}</h3>

              <p className="text-xs font-light leading-relaxed text-muted max-w-[45ch]">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ValuePropsSection;
