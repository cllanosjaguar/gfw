require 'rails_helper'
require Rails.root.join(
  'spec', 'controllers', 'shared_examples', 'renders_index.rb'
)
require Rails.root.join(
  'spec', 'controllers', 'shared_examples', 'assigns_title.rb'
)

describe SmallGrantsFundController, type: :controller do
  describe 'GET index' do
    subject { get :index }
    it_behaves_like 'renders index'
    it_behaves_like 'assigns title', 'Small Grants Fund'
  end
end
