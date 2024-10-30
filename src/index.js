import { registerBlockType } from '@wordpress/blocks';
import { RichText, MediaUpload } from '@wordpress/editor';
import { Button, PanelBody, TextControl } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import './style.scss'; // import the SCSS file

const HOTSPOT_DEFAULTS = {
    x: 0.5,
    y: 0.5,
    label: ''
};

registerBlockType('codeless-blocks/hotspot', {
    title: 'Hotspot Block by Codeless',
    icon: 'location',
    category: 'common',
    attributes: {
        image: {
            type: 'string',
            source: 'attribute',
            selector: 'img',
            attribute: 'src'
        },
        hotspots: {
            type: 'array',
            default: [],
            source: 'query',
            selector: '.hotspot',
            query: {
                x: {
                    type: 'number',
                    source: 'attribute',
                    attribute: 'data-x'
                },
                y: {
                    type: 'number',
                    source: 'attribute',
                    attribute: 'data-y'
                },
                label: {
                    type: 'string',
                    source: 'attribute',
                    attribute: 'data-label'
                },
                link: {
                    type: 'string',
                    source: 'attribute',
                    attribute: 'href'
                }

            }
        }
    },

    edit: ({ attributes, setAttributes }) => {
        const [activeIndex, setActiveIndex] = useState(-1);
      
        const onHotspotClick = (e) => {
          const rect = e.target.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const y = (e.clientY - rect.top) / rect.height;
          const hotspots = [
            ...attributes.hotspots,
            {
              ...HOTSPOT_DEFAULTS,
              x,
              y
            }
          ];
          setAttributes({ hotspots });
        };
      
        const onHotspotLabelChange = (value, index) => {
          const hotspots = [...attributes.hotspots];
          hotspots[index].label = value;
          setAttributes({ hotspots });
        };
      
        const onHotspotLinkChange = (value, index) => {
          const hotspots = [...attributes.hotspots];
          hotspots[index].link = value;
          setAttributes({ hotspots });
        };
      
        const onHotspotRemove = (index) => {
          const hotspots = [...attributes.hotspots];
          hotspots.splice(index, 1);
          setAttributes({ hotspots });
        };
      
        const onHotspotOptionsClick = (index) => {

          setActiveIndex(activeIndex === index ? index : index);
        };

        const onClickOutside = (e) => {
            const cont = e.target.closest('.hotspot-image-container');
    
            if (!cont) {
                setActiveIndex(-1);
            }
        };
    
        useEffect(() => {
            document.addEventListener('click', onClickOutside);
            return () => {
                document.removeEventListener('click', onClickOutside);
            };
        }, []);
      
        return (
          <div className="hotspot-block">
            <MediaUpload
              onSelect={(image) => setAttributes({ image: image.sizes.full.url })}
              render={({ open }) => (
                <Button
                  className={attributes.image ? "image-button" : "button button-large"}
                  onClick={open}
                >
                  {!attributes.image ? "Select Image" : "Change Image"}
                </Button>
              )}
            />
            {attributes.image && (
              <div className="hotspot-image-container">
                <img
                  src={attributes.image}
                  onClick={onHotspotClick}
                  className="hotspot-image"
                />
                {attributes.hotspots.map((hotspot, index) => (
                  <div
                    key={index}
                    className={`hotspot ${activeIndex === index ? "active" : ""}`}
                    data-x={hotspot.x}
                    data-y={hotspot.y}
                    data-label={hotspot.label}
                    style={{ left: `${hotspot.x * 100}%`, top: `${hotspot.y * 100}%` }}
                    onClick={(e) => {e.preventDefault(); onHotspotOptionsClick(index)} }
                  >
                    <div className="hotspot-label">{hotspot.label}</div>
      
                    {activeIndex === index && (
                      <div className="hotspot-options">
                        <label>
                          <input
                            type="text"
                            value={hotspot.label}
                            placeholder="Label"
                            onChange={(e) => onHotspotLabelChange(e.target.value, index)}
                          />
                        </label>
                        <label>
                          <input
                            type="text"
                            value={hotspot.link}
                            onChange={(e) => onHotspotLinkChange(e.target.value, index)}
                            placeholder="Link URL"
                          />
                        </label>
                        <Button
                          className="remove-button"
                          onClick={() => onHotspotRemove(index)}
                          icon="dismiss"
                        />
                      </div>
                    )}
                   
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      },

    save: ({ attributes }) => {
		const { image, hotspots } = attributes;
		return (
			<div className="hotspot-block">
				<div class="hotspot-image-container">
					<img src={ image } alt="Hotspot Background" />
				
					{ hotspots.map((hotspot, index) => (
						<a
                            key={ index }
                            className="hotspot"
                            data-x={ hotspot.x }
                            data-y={ hotspot.y }
                            data-label={ hotspot.label }
                            style={ { left: `${hotspot.x * 100}%`, top: `${hotspot.y * 100}%` } }
                            href={ hotspot.link }
                            target="_blank"
                            rel="noopener noreferrer"
                        >
							<span className="hotspot-label">{ hotspot.label }</span>
						</a>
					)) }
				</div>
			</div>
		);
	}	
});