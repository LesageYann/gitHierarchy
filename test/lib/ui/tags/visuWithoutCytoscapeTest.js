describe('visu spec', function() {

  it('ask for import cytoscape visualization', function() {
    window.cytoscape=null;
    var html = document.createElement('visu');
    document.body.appendChild(html);
    tag = riot.mount('visu')[0];
    expect(tag.root.outerHTML).have.string("you may include js.cytoscape.org in your page");
  });
});