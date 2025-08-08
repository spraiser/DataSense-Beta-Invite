class ContentInjection {
    constructor() {
        this.variations = null;
        this.currentVariation = null;
        this.contentBlocks = null;
    }

    async loadVariations() {
        try {
            const response = await fetch('variations-data.json');
            if (!response.ok) {
                throw new Error(`Failed to load variations: ${response.status}`);
            }
            const data = await response.json();
            this.variations = data.variations;
            
            const blocksResponse = await fetch('content-blocks.json');
            if (blocksResponse.ok) {
                const blocksData = await blocksResponse.json();
                this.contentBlocks = blocksData.blocks;
            }
            
            return this.variations;
        } catch (error) {
            console.error('Error loading variations:', error);
            return null;
        }
    }

    applyVariation(variationId) {
        if (!this.variations || !this.variations[variationId]) {
            console.warn(`Variation ${variationId} not found`);
            return false;
        }

        const variation = this.variations[variationId];
        const content = variation.content;
        
        const elements = document.querySelectorAll('[data-content-id]');
        let appliedCount = 0;
        
        elements.forEach(element => {
            const contentId = element.getAttribute('data-content-id');
            
            if (content[contentId]) {
                const originalHTML = element.innerHTML;
                const originalText = element.textContent.trim();
                
                if (element.children.length > 0) {
                    const textNodes = [];
                    const walker = document.createTreeWalker(
                        element,
                        NodeFilter.SHOW_TEXT,
                        {
                            acceptNode: function(node) {
                                if (node.nodeValue.trim()) {
                                    return NodeFilter.FILTER_ACCEPT;
                                }
                                return NodeFilter.FILTER_REJECT;
                            }
                        }
                    );
                    
                    let node;
                    while (node = walker.nextNode()) {
                        textNodes.push(node);
                    }
                    
                    if (textNodes.length > 0) {
                        textNodes[0].nodeValue = content[contentId];
                        for (let i = 1; i < textNodes.length; i++) {
                            textNodes[i].nodeValue = '';
                        }
                    }
                } else {
                    element.textContent = content[contentId];
                }
                
                appliedCount++;
            }
        });
        
        if (this.contentBlocks) {
            Object.keys(this.contentBlocks).forEach(blockId => {
                const block = this.contentBlocks[blockId];
                if (content[blockId] && block.selector) {
                    const elements = document.querySelectorAll(block.selector);
                    elements.forEach(element => {
                        if (!element.hasAttribute('data-content-id')) {
                            element.setAttribute('data-content-id', blockId);
                            element.textContent = content[blockId];
                            appliedCount++;
                        }
                    });
                }
            });
        }
        
        this.currentVariation = variationId;
        sessionStorage.setItem('currentVariation', variationId);
        sessionStorage.setItem('variationContent', JSON.stringify(content));
        
        console.log(`Applied variation "${variationId}" to ${appliedCount} elements`);
        return true;
    }

    getCurrentVariation() {
        if (this.currentVariation) {
            return this.currentVariation;
        }
        
        const storedVariation = sessionStorage.getItem('currentVariation');
        if (storedVariation) {
            this.currentVariation = storedVariation;
            
            const storedContent = sessionStorage.getItem('variationContent');
            if (storedContent) {
                try {
                    const content = JSON.parse(storedContent);
                    return {
                        id: storedVariation,
                        content: content,
                        name: this.variations && this.variations[storedVariation] 
                            ? this.variations[storedVariation].name 
                            : storedVariation
                    };
                } catch (e) {
                    console.error('Error parsing stored variation content:', e);
                }
            }
        }
        
        return storedVariation || 'default';
    }

    async saveVariation(variationId, content) {
        if (!this.variations) {
            await this.loadVariations();
        }
        
        if (!this.variations) {
            console.error('Unable to load variations data');
            return false;
        }
        
        if (!this.variations[variationId]) {
            this.variations[variationId] = {
                name: `Custom Variation ${Object.keys(this.variations).length}`,
                content: {}
            };
        }
        
        if (typeof content === 'object' && content !== null) {
            this.variations[variationId].content = {
                ...this.variations[variationId].content,
                ...content
            };
        } else {
            console.error('Invalid content format. Expected object.');
            return false;
        }
        
        try {
            const response = await fetch('/api/variations/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    variationId: variationId,
                    content: this.variations[variationId].content
                })
            });
            
            if (response.ok) {
                console.log(`Variation "${variationId}" saved successfully`);
                sessionStorage.setItem(`variation_${variationId}`, JSON.stringify(this.variations[variationId]));
                return true;
            } else {
                console.warn('Server save failed, saving to local storage only');
                localStorage.setItem(`datasense_variation_${variationId}`, JSON.stringify(this.variations[variationId]));
                return true;
            }
        } catch (error) {
            console.error('Error saving variation:', error);
            localStorage.setItem(`datasense_variation_${variationId}`, JSON.stringify(this.variations[variationId]));
            console.log('Saved to local storage as fallback');
            return true;
        }
    }

    getVariationContent(variationId) {
        if (!this.variations || !this.variations[variationId]) {
            return null;
        }
        return this.variations[variationId].content;
    }

    getAllVariations() {
        return this.variations;
    }

    clearCurrentVariation() {
        this.currentVariation = null;
        sessionStorage.removeItem('currentVariation');
        sessionStorage.removeItem('variationContent');
    }

    exportVariations() {
        if (!this.variations) {
            console.error('No variations loaded');
            return null;
        }
        
        const exportData = {
            variations: this.variations,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        return JSON.stringify(exportData, null, 2);
    }

    importVariations(jsonData) {
        try {
            const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
            
            if (data.variations) {
                this.variations = data.variations;
                return true;
            }
            
            console.error('Invalid import data format');
            return false;
        } catch (error) {
            console.error('Error importing variations:', error);
            return false;
        }
    }
}

const contentInjection = new ContentInjection();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContentInjection;
}