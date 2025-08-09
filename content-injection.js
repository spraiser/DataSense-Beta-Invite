class ContentInjection {
    constructor() {
        this.variations = null;
        this.currentVariation = null;
        this.contentBlocks = null;
    }

    async loadVariations() {
        // First check localStorage for edited variations
        const storageKey = 'vibe_kanban_variations';
        const localData = localStorage.getItem(storageKey);
        
        if (localData) {
            try {
                const parsedData = JSON.parse(localData);
                if (parsedData.variations) {
                    this.variations = parsedData.variations;
                    console.log('Loaded edited variations from localStorage');
                    
                    // Merge with embedded data to ensure all variations exist
                    if (window.VARIATIONS_DATA && window.VARIATIONS_DATA.variations) {
                        for (const key in window.VARIATIONS_DATA.variations) {
                            if (!this.variations[key]) {
                                this.variations[key] = window.VARIATIONS_DATA.variations[key];
                            }
                        }
                    }
                    return this.variations;
                }
            } catch (e) {
                console.warn('Failed to parse localStorage variations:', e);
            }
        }
        
        try {
            // Try to load from JSON files
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
            console.warn('Error loading variations from JSON, using embedded data:', error.message);
            
            // Fallback to embedded data for file:// protocol
            if (window.VARIATIONS_DATA) {
                this.variations = window.VARIATIONS_DATA.variations;
                console.log('Loaded variations from embedded data');
                return this.variations;
            }
            
            console.error('No variations data available');
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
                this.replaceTextContent(element, content[contentId]);
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

    replaceTextContent(element, newContent) {
        const preserveAttributes = element.getAttribute('data-preserve-attributes') === 'true';
        const replaceMode = element.getAttribute('data-replace-mode') || 'text';
        
        if (replaceMode === 'html') {
            element.innerHTML = newContent;
            return;
        }
        
        if (element.children.length === 0 || replaceMode === 'text-only') {
            element.textContent = newContent;
            return;
        }
        
        const hasNestedContent = element.querySelectorAll('[data-content-id]').length > 0;
        if (hasNestedContent) {
            const firstTextNode = this.findFirstTextNode(element);
            if (firstTextNode) {
                firstTextNode.nodeValue = newContent;
            }
            return;
        }
        
        const textNodes = this.getAllTextNodes(element);
        
        if (textNodes.length === 0) {
            const textNode = document.createTextNode(newContent);
            if (element.firstChild) {
                element.insertBefore(textNode, element.firstChild);
            } else {
                element.appendChild(textNode);
            }
        } else if (textNodes.length === 1) {
            textNodes[0].nodeValue = newContent;
        } else {
            const strategy = element.getAttribute('data-multi-text-strategy') || 'first';
            
            switch (strategy) {
                case 'all':
                    const parts = newContent.split(' ');
                    textNodes.forEach((node, index) => {
                        if (index < parts.length) {
                            node.nodeValue = parts[index];
                        } else {
                            node.nodeValue = '';
                        }
                    });
                    break;
                    
                case 'join':
                    textNodes.forEach((node, index) => {
                        node.nodeValue = index === 0 ? newContent : '';
                    });
                    break;
                    
                case 'first':
                default:
                    textNodes[0].nodeValue = newContent;
                    for (let i = 1; i < textNodes.length; i++) {
                        textNodes[i].nodeValue = '';
                    }
                    break;
            }
        }
    }

    findFirstTextNode(element) {
        for (let child of element.childNodes) {
            if (child.nodeType === Node.TEXT_NODE && child.nodeValue.trim()) {
                return child;
            }
            if (child.nodeType === Node.ELEMENT_NODE && !child.hasAttribute('data-content-id')) {
                const found = this.findFirstTextNode(child);
                if (found) return found;
            }
        }
        return null;
    }

    getAllTextNodes(element) {
        const textNodes = [];
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    if (node.parentElement.closest('[data-content-id]') !== element) {
                        return NodeFilter.FILTER_REJECT;
                    }
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
        
        return textNodes;
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

    markEditableContent(selector = '[data-content-id]', options = {}) {
        const elements = document.querySelectorAll(selector);
        const { 
            highlightColor = 'rgba(102, 126, 234, 0.1)',
            borderColor = 'rgba(102, 126, 234, 0.3)',
            showLabels = false,
            interactive = false
        } = options;
        
        elements.forEach(element => {
            const contentId = element.getAttribute('data-content-id');
            
            if (interactive) {
                element.style.transition = 'all 0.2s ease';
                element.style.cursor = 'pointer';
                
                element.addEventListener('mouseenter', () => {
                    element.style.backgroundColor = highlightColor;
                    element.style.outline = `2px solid ${borderColor}`;
                    element.style.outlineOffset = '2px';
                });
                
                element.addEventListener('mouseleave', () => {
                    element.style.backgroundColor = '';
                    element.style.outline = '';
                });
            } else {
                element.style.backgroundColor = highlightColor;
                element.style.outline = `1px dashed ${borderColor}`;
                element.style.outlineOffset = '2px';
            }
            
            if (showLabels && contentId) {
                const label = document.createElement('span');
                label.className = 'content-id-label';
                label.textContent = contentId;
                label.style.cssText = `
                    position: absolute;
                    top: -20px;
                    left: 0;
                    font-size: 10px;
                    background: ${borderColor};
                    color: white;
                    padding: 2px 6px;
                    border-radius: 3px;
                    z-index: 1000;
                    pointer-events: none;
                `;
                
                if (element.style.position === 'static' || !element.style.position) {
                    element.style.position = 'relative';
                }
                element.appendChild(label);
            }
        });
        
        return elements.length;
    }

    unmarkEditableContent() {
        const elements = document.querySelectorAll('[data-content-id]');
        
        elements.forEach(element => {
            element.style.backgroundColor = '';
            element.style.outline = '';
            element.style.outlineOffset = '';
            element.style.transition = '';
            element.style.cursor = '';
            
            const label = element.querySelector('.content-id-label');
            if (label) {
                label.remove();
            }
        });
    }

    batchApplyContent(contentMap, options = {}) {
        const { animate = false, stagger = 50 } = options;
        let appliedCount = 0;
        let index = 0;
        
        Object.entries(contentMap).forEach(([contentId, value]) => {
            const elements = document.querySelectorAll(`[data-content-id="${contentId}"]`);
            
            elements.forEach(element => {
                if (animate) {
                    setTimeout(() => {
                        element.style.transition = 'opacity 0.3s ease';
                        element.style.opacity = '0';
                        
                        setTimeout(() => {
                            this.replaceTextContent(element, value);
                            element.style.opacity = '1';
                            appliedCount++;
                        }, 300);
                    }, index * stagger);
                    index++;
                } else {
                    this.replaceTextContent(element, value);
                    appliedCount++;
                }
            });
        });
        
        return appliedCount;
    }

    getAllContentIds() {
        const elements = document.querySelectorAll('[data-content-id]');
        const contentIds = new Set();
        
        elements.forEach(element => {
            const contentId = element.getAttribute('data-content-id');
            if (contentId) {
                contentIds.add(contentId);
            }
        });
        
        return Array.from(contentIds);
    }

    extractCurrentContent() {
        const content = {};
        const elements = document.querySelectorAll('[data-content-id]');
        
        elements.forEach(element => {
            const contentId = element.getAttribute('data-content-id');
            if (contentId && !content[contentId]) {
                content[contentId] = element.textContent.trim();
            }
        });
        
        return content;
    }
}

// Initialize and auto-load variations
document.addEventListener('DOMContentLoaded', async function() {
    console.log('ContentInjection: Initializing...');
    
    // Create global instance
    window.contentInjection = new ContentInjection();
    
    // Load variations data
    await window.contentInjection.loadVariations();
    console.log('ContentInjection: Variations loaded', window.contentInjection.variations ? Object.keys(window.contentInjection.variations) : 'none');
    
    // Check for saved variation
    const savedVariation = sessionStorage.getItem('selectedVariation') || 'default';
    console.log('ContentInjection: Applying variation:', savedVariation);
    
    // Apply the variation
    if (window.contentInjection.variations) {
        window.contentInjection.applyVariation(savedVariation);
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContentInjection;
}