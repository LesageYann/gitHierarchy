describe('Hierarchy spec : ', function() {
  
  before(function() {
    var html = document.createElement('hierarchy');
    document.body.appendChild(html);
    tag = riot.mount('hierarchy')[0];
  });
  
  it('mounts a hierarchy tag', function() {
    expect(tag).to.exist;
  })
  
  it('visu is created by hierarchy', function() {
    expect(tag).to.exist;
  })
  
  describe('with cy is : ', function() {
    
    it('cytoscape context is created', function() {
       expect(tag.cy).to.exist;
    });
  });
});

